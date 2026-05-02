import {useAuthStore} from '~/stores/auth'
import {useAlertStore} from '~/stores/alert'
import {debugLog} from '~/utils/debug'
import type {FetchResponse, FetchRequest} from 'ofetch'

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()

    const IGNORE_ALERT_STATUSES = [401, 403]
    const IGNORE_ALERT_URLS = ['/auth/me']

    let csrfCookieObtained = false

    debugLog('[api plugin] init')

    async function ensureCsrfCookie() {
        if (csrfCookieObtained) {
            debugLog('[api] CSRF cookie already obtained')
            return
        }

        if (import.meta.server) {
            debugLog('[api] Skipping CSRF on server')
            return
        }

        try {
            debugLog('[api] Getting CSRF cookie...')

            await $fetch('/sanctum/csrf-cookie', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })

            csrfCookieObtained = true
            debugLog('[api] ✓ CSRF cookie obtained')
        } catch (e: any) {
            debugLog('[api] ✗ CSRF cookie error:', e)
            console.error('CSRF cookie failed:', e)
        }
    }

    function normalizeResponse(response: FetchResponse<any>, request: FetchRequest) {
        const data = response?._data

        if (!data || typeof data !== 'object') return

        if (data.success === true) {
            response._data = data.data
        }

        if (data.success === false) {
            handleErrors(response, request)

            const error: any = new Error(data.message || 'API Error')
            error.status = response.status
            error.data = data
            throw error
        }
    }

    function handleErrors(response: FetchResponse<any>, request: FetchRequest) {
        if (!import.meta.client) return

        const alert = useAlertStore()
        const auth = useAuthStore()

        const status = response.status
        const url = String(request)

        debugLog('[api] onResponseError:', {status, url, data: response._data})

        const isIgnoredStatus = IGNORE_ALERT_STATUSES.includes(status)
        const isIgnoredUrl = IGNORE_ALERT_URLS.some(u => url.includes(u))

        if (status === 401) {
            if (isIgnoredUrl) return
            debugLog('[api] 401 → logoutLocal')
            auth.logoutLocal()
            return
        }

        if (status === 419) {
            debugLog('[api] 419 CSRF mismatch - resetting')
            csrfCookieObtained = false
            return
        }

        if (isIgnoredStatus || isIgnoredUrl) return

        const data = response._data

        if (data?.errors) {
            if (typeof data.errors === 'string') {
                alert.add('error', data.errors)
            } else {
                Object.values(data.errors).forEach((arr: any) => {
                    if (Array.isArray(arr)) {
                        arr.forEach((msg: string) => alert.add('error', msg))
                    }
                })
            }
        } else if (data?.message) {
            alert.add('error', data.message)
        }
    }

    /*
    |--------------------------------------------------------------------------
    | API (SANCTUM SPA) - БЕЗ baseURL!
    |--------------------------------------------------------------------------
    */

    const api = $fetch.create({

        // Если нет baseURL - используем относительные пути через Nuxt прокси
        baseURL: config.public.apiBase, // http://laravel/api

        credentials: 'include',

        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },

        async onRequest({options}) {
            debugLog('[api] onRequest:', {
                method: options.method,
                body: options.body
            })

            if (import.meta.client) {
                const method = (options.method || 'GET').toUpperCase()
                if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
                    await ensureCsrfCookie()
                }
            }
        },

        onResponse({response, request}) {
            debugLog('[api] onResponse:', {
                status: response.status,
                url: request
            })
            normalizeResponse(response, request)
        },

        onResponseError({response, request}) {
            handleErrors(response, request)
        }

    })

    /*
    |--------------------------------------------------------------------------
    | API V1 (Bearer Token)
    |--------------------------------------------------------------------------
    */

    const sessionTokenCookie = useCookie<string | null>('web_session_token', {
        default: () => null,
        path: '/',
        sameSite: 'lax'
    })

    const apiV1 = $fetch.create({

        baseURL: config.public.apiBase + '/v1', // http://laravel/api/v1

        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },

        onRequest({options}) {
            debugLog('[apiV1] onRequest:', options)

            const auth = useAuthStore()
            let token = auth.getToken?.() || sessionTokenCookie.value

            if (!token) return

            const headers = new Headers(options.headers as HeadersInit | undefined)
            headers.set('Authorization', `Bearer ${token}`)
            options.headers = headers
        },

        onResponse({response, request}) {
            normalizeResponse(response, request)
        },

        onResponseError({response, request}) {
            handleErrors(response, request)
        }

    })

    debugLog('[api plugin] ready')

    return {
        provide: {
            api,
            apiV1,
            ensureCsrfCookie
        }
    }

})

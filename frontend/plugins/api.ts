import type {FetchResponse, FetchRequest} from 'ofetch'
import {debugLog} from '~/utils/debug'
import {useAlertStore} from '~/stores/alert'
import {useAuthStore} from '~/stores/auth'

export default defineNuxtPlugin(() => {

    const config = useRuntimeConfig()

    const IGNORE_ALERT_STATUSES = [401, 403]
    const IGNORE_ALERT_URLS = ['/auth/me']

    let csrfCookieObtained = false

    debugLog('[api plugin] init')

    /*
    |--------------------------------------------------------------------------
    | CSRF (SPA only)
    |--------------------------------------------------------------------------
    */

    async function ensureCsrfCookie() {
        if (csrfCookieObtained) return
        //if (import.meta.server) return

        try {
            await $fetch('/sanctum/csrf-cookie', {
                baseURL: config.public.backendBase,
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })

            csrfCookieObtained = true
            debugLog('[api] ✓ CSRF cookie obtained')
        } catch (e) {
            console.error('CSRF cookie failed:', e)
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Response normalizer
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Error handler
    |--------------------------------------------------------------------------
    */

    function handleErrors(response: FetchResponse<any>, request: FetchRequest) {
        if (!import.meta.client) return

        const alert = useAlertStore()
        const auth = useAuthStore()

        const status = response.status
        const url = String(request)

        const isIgnoredStatus = IGNORE_ALERT_STATUSES.includes(status)
        const isIgnoredUrl = IGNORE_ALERT_URLS.some(u => url.includes(u))

        if (status === 401) {
            if (!isIgnoredUrl) auth.logoutLocal()
            return
        }

        if (status === 419) {
            csrfCookieObtained = false
            return
        }

        if (isIgnoredStatus || isIgnoredUrl) return

        const data = response._data

        if (data?.errors) {
            Object.values(data.errors).forEach((arr: any) => {
                if (Array.isArray(arr)) {
                    arr.forEach((msg: string) => alert.add('error', msg))
                }
            })
        } else if (data?.message) {
            alert.add('error', data.message)
        }
    }

    function getCookie(name: string) {
        if (!import.meta.client) return null
        const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
        const value = match?.[1]
        return value ? decodeURIComponent(value) : null
    }

    function withXsrfHeader(options: any) {
        const token = getCookie('XSRF-TOKEN')
        if (!token) return

        const headers = new Headers(options.headers as HeadersInit)
        headers.set('X-XSRF-TOKEN', token)
        options.headers = headers
    }

    /*
    |--------------------------------------------------------------------------
    | SPA API (/api)
    |--------------------------------------------------------------------------
    */

    const api = $fetch.create({

        baseURL: config.public.apiBase, // http://laravel/api

        credentials: 'include',

        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },

        async onRequest({options}) {
            const method = (options.method || 'GET').toUpperCase()
            const skipCsrf = (options as any).skipCsrf

            console.log('[api req] SPA API', method, options.baseURL || '')

            if (
                import.meta.client &&
                !skipCsrf &&
                ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
            ) {
                await ensureCsrfCookie()
            }
        },

        onResponse({response, request}) {
            normalizeResponse(response, request)
        },

        onResponseError({response, request}) {
            handleErrors(response, request)
        }
    })

    /*
    |--------------------------------------------------------------------------
    | EXTERNAL API V1 (/api/v1)
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
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },

        onRequest({options}) {
            const method = (options.method || 'GET').toUpperCase()
            const auth = useAuthStore()
            const token = auth.getToken?.() || sessionTokenCookie.value

            console.log('[api req] EXTERNAL API V1', method, options.baseURL || '')

            if (!token) return

            const headers = new Headers(options.headers as HeadersInit)
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

    /*
    |--------------------------------------------------------------------------
    | AUTH CLIENT (NO /api prefix, direct backend)
    |--------------------------------------------------------------------------
    */

    const authApiClient = $fetch.create({

        baseURL: config.public.backendBase, // http://laravel

        credentials: 'include',

        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },

        async onRequest({options}) {
            const method = (options.method || 'GET').toUpperCase()

            console.log('[api req] AUTH CLIENT', method, options.baseURL || '')

            if (import.meta.client && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
                await ensureCsrfCookie()
                withXsrfHeader(options)
            }
        },

        onResponse({response, request}) {
            normalizeResponse(response, request)
        },

        onResponseError({response, request}) {
            handleErrors(response, request)
        }
    })

    return {
        provide: {
            api,
            apiV1,
            authApiClient,
            ensureCsrfCookie
        }
    }

})

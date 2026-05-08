import type {FetchResponse, FetchRequest} from 'ofetch'
import {useAlertStore} from '~/stores/alert'
import {useAuthStore} from '~/stores/auth'

export default defineNuxtPlugin(() => {

    const config = useRuntimeConfig()

    const isServer = import.meta.server

    const ssrCookie = import.meta.server
        ? useRequestHeaders(['cookie']).cookie
        : ''

    const xsrfToken = useCookie<string | null>('XSRF-TOKEN', {
        default: () => null
    })

    const tokenCookie = useCookie<string | null>('web_session_token', {
        default: () => null,
        path: '/',
        sameSite: 'lax'
    })

    /**
     *
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

    /**
     *
     */

    function handleErrors(response: FetchResponse<any>, request: FetchRequest) {
        if (!import.meta.client) return
        const alert = useAlertStore()
        const auth = useAuthStore()
        const status = response.status
        const url = String(request)
        if (status === 401) return
        if (status === 419) return
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

    /**
     *
     */

    function getBrowserCookie(): string | undefined {
        if (import.meta.server) return undefined
        return document.cookie
    }

    /**
     *
     */

    function applyAuthHeaders(options: any) {
        const method = String(options.method || 'GET').toUpperCase()
        if (import.meta.server) {
            applySsrCookie(options)
            return
        }
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
            applyXsrfHeader(options)
        }
    }

    /**
     * Передача кук на серверном рендере
     *
     * Нужно применять для:
     *
     * GET /api/me                    (проверка авторизации на SSR)
     * GET /api/user/profile          (данные пользователя на SSR)
     * GET /api/dashboard             (SSR-защищенная страница)
     * Любые GET-запросы к защищенным страницам на сервере
     *
     * НЕ нужно применять для:
     *
     * Клиентские запросы (process.client)
     * POST /login (если уже есть куки)
     * Запросы без авторизации (публичные страницы)
     */
    function applySsrCookie(options: any) {
        if (!import.meta.server || !ssrCookie) return
        const headers = new Headers(options.headers as HeadersInit)
        headers.set('cookie', ssrCookie)
        options.headers = headers
    }

    /**
     * CSRF-защита для POST-запросов
     *
     * Нужно применять для:
     *
     * POST /login                    (логин)
     * POST /register                 (регистрация)
     * POST /logout                   (выход)
     * PUT /api/user/profile          (обновление профиля)
     * DELETE /api/cart/item          (удаление из корзины)
     * PATCH /api/settings            (настройки)
     *
     * НЕ нужно применять для:
     *
     * GET /api/me                    (GET не требует CSRF)
     * GET /api/public                (публичные данные)
     * HEAD-запросы
     */
    function applyXsrfHeader(options: any) {
        const method = String(options.method || 'GET').toUpperCase()
        const unsafeMethods = ['POST', 'PUT', 'PATCH', 'DELETE']
        if (!unsafeMethods.includes(method)) return
        const token = xsrfToken.value
        if (!token) return
        const headers = new Headers(options.headers as HeadersInit)
        headers.set('X-XSRF-TOKEN', decodeURIComponent(token))
        options.headers = headers
    }

    /**
     *
     */

    function applyBearerToken(options: any) {
        const token = tokenCookie.value
        if (!token) return
        const headers = new Headers(options.headers as HeadersInit)
        headers.set('Authorization', `Bearer ${token}`)
        options.headers = headers
    }

    /**
     *
     */

    function getXsrfToken(): string | null {
        if (import.meta.server) {
            return null
        }
        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
        if (!match?.[1]) {
            return null
        }
        return decodeURIComponent(match[1])
    }

    /**
     *
     */

    function getSsrCookies(): string | undefined {
        if (!import.meta.server) {
            return undefined
        }
        try {
            return useRequestHeaders(['cookie']).cookie
        } catch {
            return undefined
        }
    }

    /**
     *
     */

    const csrf = $fetch.create({
        baseURL: config.public.backendBase,
        credentials: 'include',
    })

    async function ensureCsrf() {
        const existingToken = getXsrfToken()
        if (import.meta.server || existingToken) {
            return
        }
        await $fetch('/sanctum/csrf-cookie', {
            baseURL: config.public.apiBase,
            credentials: 'include'
        })
    }

    /**
     *
     */

    const api = $fetch.create({
        baseURL: config.public.apiBase,
        credentials: 'include',
        async onRequest({ request, options }) {
            const method = (options.method || 'GET').toUpperCase()
            const headers = new Headers(options.headers || {})
            if (import.meta.server) {
                const cookie = getSsrCookies()
                if (cookie) {
                    headers.set('cookie', cookie)
                }
            } else {
                if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
                    await ensureCsrf()
                    const xsrf = getXsrfToken()
                    if (xsrf) {
                        headers.set('X-XSRF-TOKEN', xsrf)
                    }
                }
            }
            options.headers = headers
        },
        onResponse({response, request}) {
            normalizeResponse(response, request)
        },
        onResponseError({response, request}) {
            handleErrors(response, request)
        }
    })

    /**
     *
     */

    const apiToken = $fetch.create({
        baseURL: config.public.apiBase,
        onRequest({options}) {
            applyBearerToken(options)
            if (import.meta.server && ssrCookie) {
                const headers = new Headers(options.headers as HeadersInit)
                headers.set('cookie', ssrCookie)
                options.headers = headers
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
            csrf,
            api,
            apiToken
        }
    }

})

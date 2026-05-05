import type {FetchResponse, FetchRequest} from 'ofetch'
import {useAlertStore} from '~/stores/alert'
import {useAuthStore} from '~/stores/auth'

export default defineNuxtPlugin(() => {

    const config = useRuntimeConfig()

    const IGNORE_ALERT_STATUSES = [401, 403]
    const IGNORE_ALERT_URLS = [
        '/auth/me',
        '/api/cart'
    ]

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

    const defaultHeaders: Record<string, string> = {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
        'Content-Type': 'application/json',
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

        const isIgnoredStatus = IGNORE_ALERT_STATUSES.includes(status)
        const isIgnoredUrl = IGNORE_ALERT_URLS.some(u => url.includes(u))

        if (status === 401) {
            debugLog('[auth] handleErrors 401')
            if (!isIgnoredUrl) {
                auth.logoutLocal()
            }
            return
        }

        if (status === 419) return
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

    function applySsrCookie(options: any) {
        if (!import.meta.server || !ssrCookie) return

        const headers = new Headers(options.headers as HeadersInit)
        headers.set('cookie', ssrCookie)
        options.headers = headers
    }

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

    function applyBearerToken(options: any) {
        const token = tokenCookie.value
        if (!token) return

        const headers = new Headers(options.headers as HeadersInit)
        headers.set('Authorization', `Bearer ${token}`)
        options.headers = headers
    }

    const csrf = $fetch.create({

        baseURL: config.public.backendBase,
        credentials: 'include',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/json'
        },

        onRequest({options}) {
            debugLog('csrf', options)
            applySsrCookie(options)
        },

        onResponse({response, request}) {
            debugLog('response', response)
            debugLog('request', request)
        },

        onResponseError({response, request}) {
            debugLog('response err', response)
            debugLog('request err', request)
        }

    })

    const backend = $fetch.create({

        baseURL: config.public.backendBase,
        credentials: 'include',
        headers: defaultHeaders,

        onRequest({options}) {
            debugLog('backend', options)
            applySsrCookie(options)
            /*
            fetch (в отличие от axios) не добавляет автоматически заголовок X-XSRF-TOKEN,
            поэтому Laravel Sanctum не может сопоставить CSRF-токен только по cookies.
            Laravel для web.php POST-запросов требует одновременно:
            - cookie XSRF-TOKEN
            - заголовок X-XSRF-TOKEN (из этого cookie)
            backend interceptor добавляет X-XSRF-TOKEN вручную для unsafe методов
            (POST, PUT, PATCH, DELETE), извлекая значение из cookie.
            login/register/logout сначала выполняют запрос к /sanctum/csrf-cookie,
            чтобы установить корректные CSRF cookies до выполнения POST-запроса.
            это устраняет ошибку 419 CSRF token mismatch в web.php маршрутах
            */
            applyXsrfHeader(options)
        },

        onResponse({response, request}) {
            debugLog('response', response)
            debugLog('request', request)
            normalizeResponse(response, request)
        },

        onResponseError({response, request}) {
            debugLog('response err', response)
            debugLog('request err', request)
            handleErrors(response, request)
        }

    })

    const api = $fetch.create({

        baseURL: config.public.apiBase,
        credentials: 'include',
        headers: defaultHeaders,

        onRequest({options}) {
            debugLog('api', options)
            applySsrCookie(options)
        },

        onResponse({response, request}) {
            debugLog('response', response)
            debugLog('request', request)
            normalizeResponse(response, request)
        },

        onResponseError({response, request}) {
            debugLog('response err', response)
            debugLog('request err', request)
            handleErrors(response, request)
        }

    })

    const apiToken = $fetch.create({

        baseURL: config.public.apiBase,
        headers: defaultHeaders,

        onRequest({options}) {
            debugLog('apiToken', options)
            applyBearerToken(options)
            if (import.meta.server && ssrCookie) {
                const headers = new Headers(options.headers as HeadersInit)
                headers.set('cookie', ssrCookie)
                options.headers = headers
            }
            // const auth = useAuthStore()
            // const token = auth.getToken()
            // const headers = new Headers(options.headers as HeadersInit)
            // if (token) {
            //     headers.set('Authorization', `Bearer ${token}`)
            // }
            //
            // applyBearerToken(options)
            // if (import.meta.server && ssrCookie) {
            //     headers.set('cookie', ssrCookie)
            // }
            // options.headers = headers
        },

        onResponse({response, request}) {
            normalizeResponse(response, request)
        },

        onResponseError({response, request}) {
            handleErrors(response, request)
        }

    })

    const apiV1 = $fetch.create({

        baseURL: config.public.apiBase + '/v1',
        headers: defaultHeaders,

        onRequest({options}) {
            debugLog('apiV1', options)
            applyBearerToken(options)
            if (import.meta.server && ssrCookie) {
                const headers = new Headers(options.headers as HeadersInit)
                headers.set('cookie', ssrCookie)
                options.headers = headers
            }
            // const auth = useAuthStore()
            // const token = auth.getToken()
            // const headers = new Headers(options.headers as HeadersInit)
            // if (token) {
            //     headers.set('Authorization', `Bearer ${token}`)
            // }
            //
            // applyBearerToken(options)
            // if (import.meta.server && ssrCookie) {
            //     headers.set('cookie', ssrCookie)
            // }
            // options.headers = headers
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
            backend,
            csrf,
            api,
            apiToken,
            apiV1
        }
    }

})

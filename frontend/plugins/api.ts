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

    function prettyOptions(options: any) {
        const headers = options.headers instanceof Headers
            ? Object.fromEntries(options.headers.entries())
            : options.headers

        return {
            url: options.baseURL + (options.url || ''),
            method: options.method || 'GET',
            query: options.query || null,
            body: options.body || null,
            headers: headers || {},
            credentials: options.credentials || null
        }
    }

    function debugRequest(name: string, options: any) {
        console.group(`🟡 ${name} REQUEST`)
        console.log(prettyOptions(options))
        console.groupEnd()
    }

    function debugResponse(name: string, response: any, request: any) {
        console.group(`🟢 ${name} RESPONSE`)
        console.log('url:', request)
        console.log('status:', response.status)
        console.log('data:', response._data)
        console.groupEnd()
    }

    function debugError(name: string, response: any, request: any) {
        console.group(`🔴 ${name} ERROR`)
        console.log('url:', request)
        console.log('status:', response.status)
        console.log('data:', response._data)
        console.groupEnd()
    }

    function debugTokenFlow(name: string) {
        const token = tokenCookie.value
        const xsrf = xsrfToken.value

        console.group(`${name} TOKENS`)

        console.log('cookie token (web_session_token):', token)
        console.log('Authorization header:', token ? `Bearer ${token}` : null)

        console.log('XSRF cookie:', xsrf)
        console.log('XSRF header (will be sent):', xsrf ? decodeURIComponent(xsrf) : null)

        console.groupEnd()
    }

    function trace(label: string) {
        return `[TRACE ${label}] ${Date.now()}`
    }

    const csrf = $fetch.create({

        baseURL: config.public.backendBase,
        credentials: 'include',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/json'
        },

        onRequest({options}) {
            debugLog('csrf onRequest', options)

            applySsrCookie(options)
        },

        onResponse({response, request}) {
            debugLog('csrf request onResponse', request)
            debugLog('csrf response onResponse', response)
        },

        onResponseError({response, request}) {
            debugLog('csrf request onResponseError', request)
            debugLog('csrf response onResponseError', response)
        }

    })

    const backend = $fetch.create({

        baseURL: config.public.backendBase,
        credentials: 'include',
        headers: defaultHeaders,

        onRequest({options}) {
            debugLog('backend onRequest', options)
            debugTokenFlow('backend BEFORE APPLY')

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
            debugTokenFlow('backend AFTER APPLY')

            console.log('backend FINAL REQUEST HEADERS:', Object.fromEntries(
                (options.headers instanceof Headers
                    ? options.headers.entries()
                    : Object.entries(options.headers || {}))
            ))
        },

        onResponse({response, request}) {
            debugLog('backend response onResponse', response._data)
            console.log(trace('RESPONSE OK'), request, response.status)

            normalizeResponse(response, request)
        },

        onResponseError({response, request}) {
            debugLog('backend response onResponseError', response)
            handleErrors(response, request)
        }

    })

    const api = $fetch.create({

        baseURL: config.public.apiBase,
        credentials: 'include',
        headers: defaultHeaders,

        onRequest({options}) {
            debugLog('api onRequest', options)
            debugTokenFlow('api BEFORE APPLY')
            applySsrCookie(options)
            debugTokenFlow('api AFTER APPLY')

            console.log('api FINAL REQUEST HEADERS:', Object.fromEntries(
                (options.headers instanceof Headers
                    ? options.headers.entries()
                    : Object.entries(options.headers || {}))
            ))
        },

        onResponse({response, request}) {
            debugLog('api response onResponse', response)
            console.log(trace('RESPONSE OK'), request, response.status)

            normalizeResponse(response, request)
        },

        onResponseError({response, request}) {
            debugLog('api response onResponseError', response)
            handleErrors(response, request)
        }

    })

    const apiToken = $fetch.create({

        baseURL: config.public.apiBase,
        headers: defaultHeaders,

        onRequest({options}) {
            debugLog('apiToken', options)

            debugTokenFlow('apiToken BEFORE APPLY')
            applyBearerToken(options)
            debugTokenFlow('apiToken AFTER APPLY')

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

            console.log('apiToken FINAL REQUEST HEADERS:', Object.fromEntries(
                (options.headers instanceof Headers
                    ? options.headers.entries()
                    : Object.entries(options.headers || {}))
            ))
        },

        onResponse({response, request}) {
            debugResponse('apiToken', response, request)
            console.log(trace('RESPONSE OK'), request, response.status)

            normalizeResponse(response, request)
        },

        onResponseError({response, request}) {
            debugError('apiToken', response, request)
            handleErrors(response, request)
        }

    })

    const apiV1 = $fetch.create({

        baseURL: config.public.apiBase + '/v1',
        headers: defaultHeaders,

        onRequest({options}) {
            debugLog('apiV1', options)

            debugTokenFlow('apiV1 BEFORE APPLY')
            applyBearerToken(options)
            debugTokenFlow('apiV1 AFTER APPLY')

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

            console.log('apiV1 FINAL REQUEST HEADERS:', Object.fromEntries(
                (options.headers instanceof Headers
                    ? options.headers.entries()
                    : Object.entries(options.headers || {}))
            ))
        },

        onResponse({response, request}) {
            debugResponse('apiV1', response, request)
            console.log(trace('RESPONSE OK'), request, response.status)

            normalizeResponse(response, request)
        },

        onResponseError({response, request}) {
            debugError('apiV1', response, request)
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

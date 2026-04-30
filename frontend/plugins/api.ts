export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    const IGNORE_ALERT_STATUSES = [401, 403]
    const IGNORE_ALERT_URLS = ['/api/me']

    const api = $fetch.create({
        baseURL: import.meta.server
            ? config.apiBaseServer
            : config.public.apiBase,

        credentials: 'include',

        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/json'
        },

        onRequest({ options }) {
            // НИКАКИХ useCookie / nuxt composables тут

            if (!import.meta.client) return

            const token = localStorage.getItem('web_session_token')
            if (!token) return

            const headers = new Headers(options.headers as HeadersInit | undefined)
            headers.set('Authorization', `Bearer ${token}`)
            options.headers = headers
        },

        onResponseError({ response, request }) {
            const alert = useAlertStore()
            const auth = useAuthStore()

            const status = response.status
            const url = request.toString()

            const isIgnoredStatus = IGNORE_ALERT_STATUSES.includes(status)
            const isIgnoredUrl = IGNORE_ALERT_URLS.some(u => url.includes(u))

            if (status === 401 && import.meta.client) {
                localStorage.removeItem('web_session_token')
                auth.logoutLocal?.()
            }

            if (isIgnoredStatus || isIgnoredUrl) return

            const data = response._data as any

            if (data?.message) {
                alert.add('error', data.message)
            }

            if (data?.errors) {
                Object.values(data.errors).forEach((arr: any) => {
                    arr.forEach((msg: string) => {
                        alert.add('error', msg)
                    })
                })
            }
        }
    })

    return {
        provide: { api }
    }
})

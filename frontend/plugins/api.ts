import {useAuthStore} from '~/stores/auth'
import {useAlertStore} from '~/stores/alert'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    const IGNORE_ALERT_STATUSES = [401, 403]
    const IGNORE_ALERT_URLS = ['/api/me']

    const api = $fetch.create({
        baseURL: config.public.apiBase,

        credentials: 'include',

        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/json'
        },

        onRequest({options}) {
            if (!import.meta.client) return

            const token = localStorage.getItem('web_session_token')
            if (!token) return

            const headers = new Headers(options.headers as HeadersInit | undefined)
            headers.set('Authorization', `Bearer ${token}`)
            options.headers = headers
        },

        onResponseError({response, request}) {
            if (!import.meta.client) return

            const alert = useAlertStore()
            const auth = useAuthStore()

            const status = response.status
            const url = String(request)

            const isIgnoredStatus = IGNORE_ALERT_STATUSES.includes(status)
            const isIgnoredUrl = IGNORE_ALERT_URLS.some(u => url.includes(u))

            if (status === 401) {
                localStorage.removeItem('web_session_token')
                auth.logoutLocal?.()
            }

            if (isIgnoredStatus || isIgnoredUrl) return

            const data: any = response._data

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
        provide: {
            api
        }
    }
})

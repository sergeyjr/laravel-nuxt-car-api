import {useAuthStore} from '~/stores/auth'
import {useAlertStore} from '~/stores/alert'
import {debugLog} from '~/utils/debug'

export default defineNuxtPlugin(() => {

    const config = useRuntimeConfig()

    const IGNORE_ALERT_STATUSES = [401, 403]
    const IGNORE_ALERT_URLS = ['/api/me']

    debugLog('[api plugin] init')

    const api = $fetch.create({

        baseURL: config.public.apiBase,

        credentials: 'include',

        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/json'
        },

        onRequest({options}) {
            debugLog('[api plugin] onRequest:', options)

            const token = useCookie<string | null>('web_session_token', {
                default: () => null,
                path: '/'
            }).value

            debugLog('[api plugin] token:', token)

            if (!token) {
                debugLog('[api plugin] no token, skip Authorization header')
                return
            }

            const headers = new Headers(options.headers as HeadersInit | undefined)
            headers.set('Authorization', `Bearer ${token}`)
            options.headers = headers

            debugLog('[api plugin] Authorization header set')
        },

        onResponseError({response, request}) {
            if (!import.meta.client) return

            const alert = useAlertStore()
            const auth = useAuthStore()

            const status = response.status
            const url = String(request)

            debugLog('[api plugin] onResponseError:', {
                status,
                url,
                response
            })

            const isIgnoredStatus = IGNORE_ALERT_STATUSES.includes(status)
            const isIgnoredUrl = IGNORE_ALERT_URLS.some(u => url.includes(u))

            debugLog('[api plugin] ignore check:', {
                isIgnoredStatus,
                isIgnoredUrl
            })

            if (status === 401) {
                debugLog('[api plugin] 401 detected')

                if (isIgnoredUrl) {
                    debugLog('[api plugin] 401 ignored by URL:', url)
                    return
                }

                debugLog('[api plugin] calling auth.logoutLocal()')
                auth.logoutLocal()
                return
            }

            if (isIgnoredStatus || isIgnoredUrl) {
                debugLog('[api plugin] error ignored:', { status, url })
                return
            }

            const data: any = response._data
            debugLog('[api plugin] error payload:', data)

            if (data?.message) {
                debugLog('[api plugin] alert message:', data.message)
                alert.add('error', data.message)
            }

            if (data?.errors) {
                debugLog('[api plugin] validation errors:', data.errors)

                Object.values(data.errors).forEach((arr: any) => {
                    arr.forEach((msg: string) => {
                        debugLog('[api plugin] alert error:', msg)
                        alert.add('error', msg)
                    })
                })
            }
        }

    })

    debugLog('[api plugin] ready')

    return {
        provide: {
            api
        }
    }

})

import {useAlertStore} from '~/stores/alert'

export default defineNuxtPlugin(() => {

    const config = useRuntimeConfig()

    const baseURL = import.meta.server
        ? config.apiBase
        : config.public.apiBase

    const ssrHeaders = import.meta.server
        ? useRequestHeaders(['cookie'])
        : {}

    const api = $fetch.create({

        baseURL: baseURL,
        credentials: 'include',

        async onRequest({request, options}) {

            const headers = new Headers(options.headers || {})

            headers.forEach((value, key) => {
                console.log('headers', key, value)
            })

            if (import.meta.server) {

                if (import.meta.server && ssrHeaders.cookie) {
                    headers.set('cookie', ssrHeaders.cookie)
                }

            } else {

                const method = String(options.method || 'GET').toUpperCase()

                if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
                    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
                    const xsrf = match?.[1] ? decodeURIComponent(match[1]) : null

                    if (xsrf) {
                        headers.set('X-XSRF-TOKEN', xsrf)
                    }
                }

            }

            options.headers = headers

        },

        onResponse({response, request}) {

            const data = response._data

            if (data && typeof data === 'object' && data.success === true) {
                response._data = data.data
            }

        },

        onResponseError({response, request}) {

            if (!import.meta.client) return

            const alert = useAlertStore()
            const data = response._data

            if (response.status === 401 || response.status === 419) return

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

    })

    return {
        provide: {
            api
        }
    }

})

import {useAlertStore} from '~/stores/alert'

export default defineNuxtPlugin(() => {

    const config = useRuntimeConfig()

    const nuxtApp = useNuxtApp()

    const locale = computed(() => nuxtApp.$i18n.locale.value)

    const ssrHeaders = import.meta.server
        ? useRequestHeaders(['cookie', 'origin', 'referer'])
        : {}

    const api = $fetch.create({

        baseURL: import.meta.server
            ? config.apiBase
            : config.public.apiBase,

        credentials: 'include',

        headers: {
            Accept: 'application/json'
        },

        async onRequest({options}) {

            const headers = new Headers(options.headers || {})

            headers.set('X-Locale', locale.value)

            if (import.meta.server) {

                if (ssrHeaders.cookie) {
                    headers.set('cookie', ssrHeaders.cookie)
                }

                if (ssrHeaders.origin) {
                    headers.set('origin', ssrHeaders.origin)
                }

                if (ssrHeaders.referer) {
                    headers.set('referer', ssrHeaders.referer)
                }

            } else {

                const method = String(options.method || 'GET').toUpperCase()

                if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {

                    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)

                    const token = match?.[1]
                        ? decodeURIComponent(match[1])
                        : null

                    if (token) {
                        headers.set('X-XSRF-TOKEN', token)
                    }

                }

            }

            options.headers = headers

        },

        onResponse({response}) {

            const data = response._data

            if (
                data &&
                typeof data === 'object' &&
                data.success === true
            ) {
                response._data = data.data
            }

        },

        onResponseError({response}) {

            if (!import.meta.client || !response) {
                return
            }

            if (response.status === 422) {
                return
            }

            const alert = useAlertStore()

            const data = response._data

            const message =
                response.status === 401
                    ? 'Необходима авторизация.'
                    : response.status === 419
                        ? 'Сессия истекла.'
                        : data?.message

            if (message) {
                alert.add('error', message)
            }

        }

    })

    return {
        provide: {
            api
        }
    }

})

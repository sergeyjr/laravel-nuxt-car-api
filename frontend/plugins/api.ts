import {useAlertStore} from '~/stores/alert'

export default defineNuxtPlugin(() => {

    const config = useRuntimeConfig()

    const ssrHeaders = import.meta.server
        ? useRequestHeaders(['cookie', 'origin', 'referer'])
        : {}

    const api = $fetch.create({

        baseURL: import.meta.server
            ? config.apiBase
            : config.public.apiBase,

        credentials: 'include',

        headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },

        async onRequest({options}) {

            const headers = new Headers(options.headers || {})

            if (import.meta.server) {

                /**
                 * Почему для SSR + Laravel Sanctum недостаточно только cookie
                 * Браузер автоматически отправляет:
                 * - Cookie
                 * - Origin
                 * - Referer
                 * Sanctum через middleware: EnsureFrontendRequestsAreStateful
                 * определяет, является ли запрос trusted SPA frontend request.
                 * Внутри Sanctum проверяется: referer ?: origin
                 * и домен сверяется с: SANCTUM_STATEFUL_DOMAINS
                 * Только после этого Sanctum включает session auth
                 * и восстанавливает auth()->user().
                 * ---
                 * SSR-запрос делает не браузер, а Nuxt(Node.js): Browser -> Nuxt SSR -> Laravel API
                 * Node-fetch/ofetch автоматически НЕ отправляют:
                 * - Origin
                 * - Referer
                 * Поэтому запрос только с cookie: { cookie }
                 * Sanctum считает stateless и auth:sanctum возвращает 401.
                 * А запрос: { cookie, origin } или: { cookie, referer }
                 * переводит Sanctum в stateful mode,
                 * после чего session auth начинает работать.
                 *
                 * Внутри middleware: EnsureFrontendRequestsAreStateful есть логика:
                 * $domain = $request->headers->get('referer') ?: $request->headers->get('origin');
                 *
                 * https://laravel.com/docs/13.x/sanctum
                 * Для аутентификации ваше SPA и API должны использовать один и тот же домен верхнего уровня.
                 * Однако они могут располагаться на разных поддоменах.
                 * Кроме того, убедитесь, что вы отправляете заголовок
                 * Accept: application/json и либо заголовок Referer, либо Origin вместе с вашим запросом.
                 */

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

                    const token = match?.[1] ? decodeURIComponent(match[1]) : null

                    if (token) {
                        headers.set('X-XSRF-TOKEN', token)
                    }

                }

            }

            options.headers = headers

        },

        onResponse({response}) {

            const data = response._data

            if (data && typeof data === 'object' && data.success === true) {
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

            //     if (data?.errors) {
            //         Object.values(data.errors).forEach((arr: any) => {
            //             if (Array.isArray(arr)) {
            //                 arr.forEach((msg: string) => {
            //                     alert.add('warning', msg)
            //                 })
            //             }
            //         })
            //         return
            //     }

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

import type {User} from '~/types/auth'

export const useAuthApi = () => {

    const config = useRuntimeConfig()

    const api = useApi()

    const headers = useRequestHeaders(['cookie'])

    return {

        csrf() {
            console.log('api.get csrf')
            return api.get('/sanctum/csrf-cookie')
        },

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
         * А запрос: { cookie, origin }
         * или: { cookie, referer }
         * переводит Sanctum в stateful mode,
         * после чего session auth начинает работать.
         *
         * https://laravel.com/docs/10.x/sanctum
         * you should ensure that you send the Accept: application/json header and either the Referer or Origin header with your request.
         *
         * Внутри middleware: EnsureFrontendRequestsAreStateful есть логика:
         * $domain = $request->headers->get('referer') ?: $request->headers->get('origin');
         */

        me() {
            console.log('api.get me')
            return api.get<User>('/api/me', {
                // Вот это ПИЗДЕЦ как важно! Без этой хуйни ничего работать не будет!
                headers: {
                    cookie: headers.cookie || '',
                    referer: config.public.apiBase,
                    origin: config.public.apiBase,
                }
            })
        },

        login(email: string, password: string) {
            console.log('api.get login')
            return api.post('/api/login', {
                email,
                password
            })
        },

        register(payload: {
            name: string
            email: string
            password: string
            password_confirmation: string
        }) {
            return api.post('/api/register', payload)
        },

        logout() {
            return api.post('/api/logout')
        }

    }
}

import type {ApiResponse} from '~/types/api'
import type {User, AuthResponse} from '~/types/auth'
import {useApi} from '~/composables/useApi'

export const useAuthApi = () => {

    const {api, apiV1, backend, csrf} = useApi()

    return {

        ensureCsrfCookie() {
            return csrf('/sanctum/csrf-cookie')
        },

        async login(email: string, password: string): Promise<AuthResponse> {
            await this.ensureCsrfCookie()

            return backend('/auth/login', {
                method: 'POST',
                body: {email, password}
            })
        },

        async loginWeb(email: string, password: string): Promise<AuthResponse> {
            await this.ensureCsrfCookie()

            return backend('/auth/login', {
                method: 'POST',
                body: { email, password }
            })
        },

        async loginToken(email: string, password: string): Promise<AuthResponse> {
            return apiV1('/auth/login', {
                method: 'POST',
                body: { email, password }
            })
        },

        async register(payload: any): Promise<AuthResponse> {
            await this.ensureCsrfCookie()

            return backend('/auth/register', {
                method: 'POST',
                body: payload
            })
        },

        async logout(): Promise<ApiResponse<null>> {
            await this.ensureCsrfCookie()

            return backend('/auth/logout', {
                method: 'POST'
            })
        },

        me(): Promise<User> {
            return backend('/auth/me')
        }

    }

}

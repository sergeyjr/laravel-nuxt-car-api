import type {ApiResponse} from '~/types/api'
import type {User, AuthResponse} from '~/types/auth'
import {useApi} from '~/composables/useApi'

export const useAuthApi = () => {

    const {api, apiV1, backend, csrf} = useApi()

    return {

        ensureCsrfCookie() {
            debugLog('[auth api ts] ensureCsrfCookie')
            return csrf('/sanctum/csrf-cookie')
        },

        async login(email: string, password: string): Promise<AuthResponse> {
            await this.ensureCsrfCookie()
            debugLog('[auth api ts] login')
            debugLog('[auth api ts] /auth/login')

            return backend('/auth/login', {
                method: 'POST',
                body: {email, password}
            })
        },

        async register(payload: any): Promise<AuthResponse> {
            debugLog('[auth api ts] register')

            await this.ensureCsrfCookie()
            debugLog('[auth api ts] /auth/register')

            return backend('/auth/register', {
                method: 'POST',
                body: payload
            })
        },

        async logout(): Promise<ApiResponse<null>> {
            debugLog('[auth api ts] logout')

            await this.ensureCsrfCookie()
            debugLog('[auth api ts] /auth/logout')

            return backend('/auth/logout', {
                method: 'POST'
            })
        },

        me(): Promise<User> {
            debugLog('[auth api ts] me START')

            const request = '/auth/me'

            debugLog('[auth api ts] me REQUEST', {
                url: request,
                method: 'GET'
            })

            return backend(request, {
                method: 'GET'
            }).then((res) => {
                debugLog('[auth api ts] me SUCCESS', res)
                return res
            }).catch((err) => {
                debugLog('[auth api ts] me ERROR', {
                    message: err?.message,
                    status: err?.status,
                    data: err?.data || err
                })
                throw err
            }).finally(() => {
                debugLog('[auth api ts] me END')
            })
        }

    }

}

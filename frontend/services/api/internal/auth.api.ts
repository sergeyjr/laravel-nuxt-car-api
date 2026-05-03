import type {ApiResponse} from '~/types/api'
import type {User, AuthResponse} from '~/types/auth'
import {useApi} from '~/composables/useApi'

export const useAuthApi = () => {

    const {authApi, apiV1} = useApi()

    return {

        // internal

        login(email: string, password: string): Promise<AuthResponse> {
            return authApi('/auth/login', {
                method: 'POST',
                body: {email, password}
            })
        },

        register(payload: any): Promise<AuthResponse> {
            return authApi('/auth/register', {
                method: 'POST',
                body: payload
            })
        },

        logout(): Promise<ApiResponse<null>> {
            return authApi('/auth/logout', {
                method: 'POST'
            })
        },

        me(): Promise<User> {
            return authApi('/auth/me')
        },

        // external

        loginExternal(data: any) {
            return apiV1('/auth/login', {
                method: 'POST',
                body: data
            })
        },

        registerExternal(data: any) {
            return apiV1('/auth/register', {
                method: 'POST',
                body: data
            })
        }
    }

}

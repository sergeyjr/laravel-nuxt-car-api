import type {AuthResponse, User} from '~/types/auth'

export const useAuthApi = () => {

    const api = useApi()

    return {

        csrf() {
            debugLog('[AuthAPI] csrf → request')
            return api.get('/sanctum/csrf-cookie')
        },

        me() {
            debugLog('[AuthAPI] me → request')
            return api.get<User>('/api/me')
        },

        login(email: string, password: string) {
            debugLog('[AuthAPI] login → request')
            return api.post<AuthResponse>('/api/login', {
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
            debugLog('[AuthAPI] register → request')
            return api.post<AuthResponse>('/api/register', payload)
        },

        logout() {
            debugLog('[AuthAPI] logout → request')
            return api.post('/api/logout')
        }

    }

}

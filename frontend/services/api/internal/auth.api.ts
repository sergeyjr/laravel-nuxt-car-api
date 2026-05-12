import type {AuthResponse, User} from '~/types/auth'

export const useAuthApi = () => {

    const api = useApi()

    return {

        csrf() {
            console.log('[AuthAPI] csrf → request')
            return api.get('/sanctum/csrf-cookie')
        },

        me() {
            console.log('[AuthAPI] me → request')
            return api.get<User>('/api/me')
        },

        login(email: string, password: string) {
            console.log('[AuthAPI] login → request')
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
            console.log('[AuthAPI] register → request')
            return api.post<AuthResponse>('/api/register', payload)
        },

        logout() {
            console.log('[AuthAPI] logout → request')
            return api.post('/api/logout')
        }

    }

}

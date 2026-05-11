import type {AuthResponse, User} from '~/types/auth'

export const useAuthApi = () => {

    const api = useApi()

    return {

        async csrf() {
            console.log('[AuthAPI] csrf → request')
            const res = await api.get('/sanctum/csrf-cookie')
            console.log('[AuthAPI] csrf → response', res)
            return res
        },

        async me() {
            console.log('[AuthAPI] me → request')
            const res = await api.get<User>('/api/me')
            console.log('[AuthAPI] me → response', res)
            return res
        },

        async login(email: string, password: string) {
            console.log('[AuthAPI] login → request', {email})
            const res = await api.post<AuthResponse>('/api/login', {
                email,
                password
            })
            console.log('[AuthAPI] login → response', res)
            return res
        },

        async register(payload: {
            name: string
            email: string
            password: string
            password_confirmation: string
        }) {
            console.log('[AuthAPI] register → request', {
                name: payload.name,
                email: payload.email
            })
            const res = await api.post<AuthResponse>('/api/register', payload)
            console.log('[AuthAPI] register → response', res)
            return res
        },

        async logout() {
            console.log('[AuthAPI] logout → request')
            const res = await api.post('/api/logout')
            console.log('[AuthAPI] logout → response', res)
            return res
        }

    }

}

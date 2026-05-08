import type {User} from '~/types/auth'

export const useAuthApi = () => {

    const api = useApi()

    return {

        csrf() {
            return api.get('/sanctum/csrf-cookie')
        },

        async me() {
            try {
                const res = await api.get<User>('/api/me')
                console.log('[auth api] me success', res)
                return res
            } catch (e) {
                console.log('[auth api] me failed', e)
                throw e
            }
        },

        login(email: string, password: string) {
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

import type {User} from '~/types/auth'

export const useAuthApi = () => {

    const api = useApi()

    return {

        csrf() {
            return api.get('/sanctum/csrf-cookie')
        },

        me() {
            return api.get<User>('/api/me')
        },

        login(
            email: string,
            password: string
        ) {
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

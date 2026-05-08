import {defineStore} from 'pinia'
import type {User} from '~/types/auth'
import {useAuthApi} from '~/services/api/internal/auth.api'

export const useAuthStore = defineStore('auth', {

    state: () => ({
        user: useState<User | null>('auth.user', () => null),
        initialized: false,
        loading: false,
        loggingOut: false,
        success: null as string | null,
        error: null as string | null,
        errors: {} as Record<string, string[]>
    }),

    getters: {
        isAuth: (state) => !!state.user
    },

    actions: {

        showAlert(type: string, message: string) {
            useAlertStore().add(type, message)
        },

        clearErrors() {
            this.errors = {}
            this.error = null
        },

        async fetchUser() {
            console.log('fetchUser')

            const api = useAuthApi()

            try {
                this.user = await api.me()
                console.log('user', this.user)

                return true
            } catch {
                this.user = null
                return false
            }

        },

        async initAuth() {

            console.log('initAuth')
            if (this.initialized) {
                console.log('initAuth return')
                return this.isAuth
            }

            try {
                return await this.fetchUser()
            } catch (e) {
                this.user = null
                return false
            } finally {
                this.initialized = true
            }

        },

        async login(
            email: string,
            password: string
        ) {

            this.loading = true
            this.clearErrors()
            const api = useAuthApi()

            try {
                await api.csrf()
                const res: any = await api.login(email, password)
                //const user = res?.data?.user
                // if (user) {
                //     this.user = user
                // } else {
                //     await this.fetchUser()
                // }
                const ok = await this.fetchUser()
                if (!ok) {
                    this.error = 'Auth session was not established'
                    return false
                }
                this.initialized = true
                return true
            } catch (e: any) {
                if (e?.status === 422) {
                    this.errors = e.data?.errors || {}
                } else {
                    this.error = e.data?.message || 'Login failed'
                }
                console.error(e)
                return false
            } finally {
                this.loading = false
            }

        },

        async register(payload: {
            name: string
            email: string
            password: string
            password_confirmation: string
        }) {

            this.loading = true
            this.clearErrors()
            const api = useAuthApi()

            try {
                await api.csrf()
                await api.register(payload)
                this.user = null
                this.initialized = true
                return true
            } catch (e: any) {
                if (e?.status === 422) {
                    this.errors = e.data?.errors || {}
                } else {
                    this.error = e.data?.message || 'Register failed'
                }
                console.error(e)
                return false
            } finally {
                this.loading = false
            }

        },

        async logout() {

            this.loggingOut = true
            const api = useAuthApi()

            try {
                await api.logout()
            } catch (e) {
                console.error(e)
            } finally {
                this.logoutLocal()
                this.loggingOut = false
            }

        },

        logoutLocal() {
            this.user = null
            this.initialized = true
        }

    }

})

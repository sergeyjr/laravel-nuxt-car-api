import {defineStore} from 'pinia'
import type {User} from '~/types/auth'
import {useAuthApi} from '~/services/api/internal/auth.api'

export const useAuthStore = defineStore('auth', {

    state: () => ({
        user: null as User | null,
        initialized: false,
        initializing: false,
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
            console.log('[authStore] showAlert:', {type, message})
            useAlertStore().add(type, message)
        },

        clearErrors() {
            console.log('[authStore] clearErrors')
            this.errors = {}
            this.error = null
        },

        async fetchUser() {

            console.log('[authStore] fetchUser:start')

            const api = useAuthApi()

            try {
                const user = await api.me()
                console.log('[authStore] fetchUser:success', user)

                this.user = user
                return true
            } catch (err) {
                console.error('[authStore] fetchUser:error', err)

                this.user = null
                return false
            }

        },

        async initAuth() {

            console.log('[authStore] initAuth:start', {
                initialized: this.initialized,
                initializing: this.initializing
            })

            if (this.initialized) {
                console.log('[authStore] initAuth:already initialized')
                return this.isAuth
            }

            if (this.initializing) {
                console.log('[authStore] initAuth:already running')
                return this.isAuth
            }

            this.initializing = true

            try {
                const result = await this.fetchUser()
                console.log('[authStore] initAuth:result', result)
                return result
            } catch (e) {
                console.error('[authStore] initAuth:error', e)
                this.user = null
                return false
            } finally {
                this.initialized = true
                this.initializing = false
                console.log('[authStore] initAuth:done')
            }

        },

        async login(email: string, password: string) {

            console.log('[authStore] login:start', {email})

            this.loading = true
            this.clearErrors()

            const api = useAuthApi()

            try {

                console.log('[authStore] login:csrf')
                await api.csrf()

                console.log('[authStore] login:request')
                const data: any = await api.login(email, password)

                if (data.user) {
                    console.log('[authStore] login:fetchUser')
                    this.user = data.user
                } else {
                    console.error('[authStore] login:user not established')
                    await this.fetchUser()
                }

                this.initialized = true
                console.log('[authStore] login:success')
                return true
            } catch (e: any) {
                console.error('[authStore] login:error', e)

                if (e?.status === 422) {
                    this.errors = e.data?.errors || {}
                    console.log('[authStore] login:validation errors', this.errors)
                } else {
                    this.error = e.data?.message || 'Ошибка входа'
                }

                return false
            } finally {
                this.loading = false
                console.log('[authStore] login:end')
            }

        },

        async register(payload: {
            name: string
            email: string
            password: string
            password_confirmation: string
        }) {

            console.log('[authStore] register:start', payload)

            this.loading = true
            this.clearErrors()

            const api = useAuthApi()

            try {

                await api.csrf()
                console.log('[authStore] register:csrf ok')

                await api.register(payload)
                console.log('[authStore] register:success')

                this.user = null
                this.initialized = true
                return true
            } catch (e: any) {
                console.error('[authStore] register:error', e)

                if (e?.status === 422) {
                    this.errors = e.data?.errors || {}
                } else {
                    this.error = e.data?.message || 'Регистрация не удалась'
                }

                return false
            } finally {
                this.loading = false
                console.log('[authStore] register:end')
            }

        },

        async logout() {

            console.log('[authStore] logout:start')

            this.loggingOut = true
            const api = useAuthApi()

            try {

                await api.logout()
                console.log('[authStore] logout:api success')

            } catch (e) {
                console.error('[authStore] logout:error', e)
            } finally {
                this.logoutLocal()
                this.loggingOut = false
                console.log('[authStore] logout:end')
            }

        },

        logoutLocal() {

            console.log('[authStore] logoutLocal')

            this.user = null
            this.initialized = true

        }
    }
})

import {defineStore} from 'pinia'
import type {User} from '~/types/auth'
import {useAuthApi} from '~/services/api/internal/auth.api'
import {useAlertStore} from './alert'

export const useAuthStore = defineStore('auth', {

    state: () => ({
        user: null as User | null,
        initialized: false,
        initializing: false,
        loading: false,
        loggingOut: false,
        success: null as string | null,
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
            this.success = null
        },

        async fetchUser() {

            const api = useAuthApi()

            try {

                const user = await api.me()

                if (!user) {
                    this.user = null
                    return false
                }

                this.user = user

                return true

            } catch {

                this.user = null

                return false

            }

        },

        async initAuth() {

            if (this.initialized) {
                return this.isAuth
            }

            if (this.initializing) {
                return this.isAuth
            }

            this.initializing = true

            try {

                return await this.fetchUser()

            } finally {

                this.initialized = true
                this.initializing = false

            }

        },

        async login(email: string, password: string) {

            this.loading = true
            this.clearErrors()

            const api = useAuthApi()
            const alert = useAlertStore()

            try {

                await api.csrf()

                const data: any = await api.login(email, password)

                if (data?.user) {
                    this.user = data.user
                } else {
                    await this.fetchUser()
                }

                this.initialized = true

                if (data?.message) {
                    alert.add('success', data.message)
                }

                return true

            } catch (e: any) {

                if (e?.status === 422) {
                    this.errors = e.data?.errors || {}
                    return false
                }

                const message = e?.data?.message || 'Ошибка входа'

                alert.add('error', message)

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
            const alert = useAlertStore()

            try {

                await api.csrf()

                const data: any = await api.register(payload)

                alert.add('success', data?.message || 'Регистрация успешно завершена')

                this.user = null
                this.initialized = true

                return true

            } catch (e: any) {

                if (e?.status === 422) {
                    this.errors = e.data?.errors || {}
                    return false
                }

                const message = e?.data?.message || 'Регистрация не удалась'

                alert.add('error', message)

                return false

            } finally {

                this.loading = false

            }

        },

        async logout() {

            this.loggingOut = true

            const api = useAuthApi()
            const alert = useAlertStore()

            try {

                await api.logout()

            } catch (e: any) {

                if (e?.status === 422) {
                    this.errors = e.data?.errors || {}
                    return false
                }

                const message = e?.data?.message || 'Ошибка выхода'

                alert.add('error', message)

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

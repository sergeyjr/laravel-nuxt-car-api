import {defineStore} from 'pinia'
import {useAlertStore} from './alert'
import {authApi} from '~/services/api/auth.api'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as any,
        initialized: false,
        loading: false,
        error: null as string | null,
        errors: {} as Record<string, string>,
        success: null as string | null,
        loggingOut: false
    }),

    getters: {
        isAuth: (state) => !!state.user
    },

    actions: {
        resetMessages() {
            this.error = null
            this.errors = {}
            this.success = null
        },

        getToken() {
            return useCookie<string | null>('web_session_token')
        },

        setToken(token: string | null) {
            useCookie('web_session_token').value = token
        },

        clearToken() {
            useCookie('web_session_token').value = null
        },

        clearErrors() {
            this.errors = {}
        },

        logoutLocal() {
            this.user = null
            this.clearToken()
            this.initialized = true
        },

        async fetchUser() {
            this.loading = true

            try {
                const data: any = await authApi.me()
                this.user = data.user
                return true

            } catch (e: any) {
                this.user = null

                if (e?.status === 401) {
                    this.clearToken()
                }

                return false

            } finally {
                this.loading = false
            }
        },

        async initAuth() {
            if (this.initialized) return this.isAuth

            const token = this.getToken().value

            if (!token) {
                this.user = null
                this.initialized = true
                return false
            }

            try {
                await this.fetchUser()
                return this.isAuth

            } catch {
                this.user = null
                return false

            } finally {
                this.initialized = true
            }
        },

        async register(payload: any) {
            this.loading = true
            this.resetMessages()

            const alertStore = useAlertStore()

            try {
                await authApi.register(payload)

                this.user = null
                alertStore.add('success', 'Успешная регистрация')

                return true

            } catch (e: any) {
                if (e?.status === 422) {
                    this.errors = e.data?.errors || {}
                } else {
                    this.error = e.data?.message || 'Ошибка регистрации'
                }
                return false

            } finally {
                this.loading = false
            }
        },

        async login(email: string, password: string) {
            this.loading = true
            this.resetMessages()

            try {
                const data: any = await authApi.login(email, password)

                if (!data?.token) {
                    this.error = 'Нет токена'
                    return false
                }

                this.setToken(data.token)
                this.user = data.user
                this.initialized = true

                return true

            } catch (e: any) {
                if (e?.status === 422) {
                    this.errors = e.data?.errors || {}
                } else {
                    this.error = e.data?.message || 'Ошибка авторизации'
                }
                return false

            } finally {
                this.loading = false
            }
        },

        async logout() {
            this.loggingOut = true

            try {
                await authApi.logout()

            } catch {
            } finally {
                this.logoutLocal()
                this.loggingOut = false
            }
        }
    }
})

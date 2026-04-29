import { defineStore } from 'pinia'
import { useAlertStore } from './alert'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as any,
        initialized: false,
        loading: false,
        error: null as string | null,
        errors: {} as Record<string, string[]>,
        success: null as string | null,
        token: useCookie<string | null>('api_token'),
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

        hydrateToken() {
            if (!import.meta.client) return
            this.token = localStorage.getItem('api_token')
        },

        setToken(token: string | null) {
            this.token = token

            if (!import.meta.client) return

            if (token) {
                localStorage.setItem('api_token', token)
            } else {
                localStorage.removeItem('api_token')
            }
        },

        clearToken() {
            if (!this.token) return

            this.token = null
            if (import.meta.client) {
                localStorage.removeItem('api_token')
            }
        },

        async fetchUser() {
            try {
                const data: any = await $fetch('/me', {
                    credentials: 'include'
                })

                this.user = data.user
                return true
            } catch (e: any) {
                console.log('ME ERROR', e?.status)
                this.user = null
                return false
            }
        },

        async initAuth() {
            if (this.initialized) {
                return this.isAuth
            }

            this.hydrateToken()

            try {
                return await this.fetchUser()
            } catch (e) {
                console.error(e)
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
                await $fetch('/sanctum/csrf-cookie', {
                    credentials: 'include'
                })

                const data: any = await $fetch('/register', {
                    method: 'POST',
                    body: payload,
                    credentials: 'include'
                })

                this.user = data.user
                alertStore.add('success', data.message)

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
                await $fetch('/sanctum/csrf-cookie', {
                    credentials: 'include'
                })

                const data: any = await $fetch('/login', {
                    method: 'POST',
                    body: { email, password },
                    credentials: 'include'
                })

                this.user = data.user
                this.setToken(data.token)

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
                await $fetch('/sanctum/csrf-cookie', {
                    credentials: 'include'
                })

                await $fetch('/logout', {
                    method: 'POST',
                    credentials: 'include'
                })
            } catch (e) {
                console.error(e)
            } finally {
                this.user = null
                this.clearToken()
                this.loggingOut = false
            }
        }
    }
})

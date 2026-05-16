import {defineStore} from 'pinia'

import type {User} from '~/types/auth'
import {useAuthApi} from '~/services/api/auth.api'
import {useAlertStore} from './alert'

export const useAuthStore = defineStore('auth', {

    state: () => ({
        user: null as User | null,
        initialized: false,
        initializing: false,
        loading: false,
        loggingOut: false,
        success: null as string | null,
        errors: {} as Record<string, string>,
    }),

    getters: {
        isAuth: (state) => !!state.user,
    },

    actions: {

        showAlert(type: string, message: string) {
            useAlertStore().add(type, message)
        },

        clearErrors() {
            this.errors = {}
            this.success = null
        },

        normalizeErrors(errors: any): Record<string, string> {
            return Object.fromEntries(
                Object.entries(errors || {}).map(([k, v]) => [
                    k,
                    Array.isArray(v) ? (v[0] ?? '') : String(v ?? ''),
                ]),
            )
        },

        async fetchUser() {
            const api = useAuthApi()

            try {
                const user = await api.me()
                this.user = user || null
                return !!user
            } catch (e: any) {
                if ([401, 403, 419].includes(e?.status)) {
                    this.user = null
                }
                console.error(e)
                return false
            }
        },

        async initAuth() {
            if (this.initialized || this.initializing) {
                return this.isAuth
            }

            this.initializing = true

            try {
                const ok = await this.fetchUser()
                this.initialized = true
                return ok
            } finally {
                this.initializing = false
            }
        },

        async login(email: string, password: string) {

            this.loading = true
            this.clearErrors()

            const api = useAuthApi()

            try {
                await api.csrf()
                const data: any = await api.login(email, password)
                if (data?.user) {
                    this.user = data.user
                } else {
                    await this.fetchUser()
                }
                this.initialized = true
                this.showAlert('success', data?.message || 'Вход в аккаунт.')
                return true
            } catch (e: any) {
                const data = e?.data || e?.response?._data || e?.response?.data || {}
                const message = data?.message || e?.message || 'Ошибка входа.'
                if (e?.status === 422 && data?.errors) {
                    this.errors = this.normalizeErrors(data.errors)
                    return false
                }
                this.errors = {
                    general: message,
                }
                // console.error(e)
                return false
            } finally {
                this.loading = false
            }
        },

        async register(payload: any) {
            this.loading = true
            this.clearErrors()

            const api = useAuthApi()

            try {
                await api.csrf()
                const data: any = await api.register(payload)
                this.showAlert('success', data?.message || 'Регистрация завершена.')
                this.user = null
                this.initialized = true
                return true
            } catch (e: any) {
                if (e?.status === 422) {
                    this.errors = this.normalizeErrors(e.data?.errors)
                    return false
                }
                this.showAlert('error', e?.data?.message || 'Ошибка регистрации.')
                return false
            } finally {
                this.loading = false
            }
        },

        async logout() {
            if (this.loggingOut) {
                return false
            }

            this.loggingOut = true

            const api = useAuthApi()

            try {
                const data: any = await api.logout()
                this.showAlert('success', data?.message || 'Выход из аккаунта.')
                this.logoutLocal()
                return true
            } catch (e: any) {
                this.showAlert('error', e?.data?.message || 'Ошибка выхода.')
                console.error(e)
                return false
            } finally {
                this.loggingOut = false
            }
        },

        logoutLocal() {
            this.user = null
            this.initialized = true
        }

    }

})

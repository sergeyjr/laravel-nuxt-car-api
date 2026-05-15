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
                if (e?.status === 401) {
                    this.user = null
                }
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
            const alert = useAlertStore()

            try {
                await api.csrf()

                const data: any = await api.login(email, password)

                this.user =
                    data?.user || (await this.fetchUser() ? this.user : null)

                this.initialized = true

                alert.add('success', data?.message || 'Вы вошли в аккаунт.')

                return true
            } catch (e: any) {
                if (e?.status === 422) {
                    this.errors = this.normalizeErrors(e.data?.errors)
                    return false
                }

                alert.add('error', e?.data?.message || 'Ошибка входа')

                return false
            } finally {
                this.loading = false
            }
        },

        async register(payload: any) {
            this.loading = true
            this.clearErrors()

            const api = useAuthApi()
            const alert = useAlertStore()

            try {
                await api.csrf()

                const data: any = await api.register(payload)

                alert.add(
                    'success',
                    data?.message || 'Регистрация успешно завершена.',
                )

                this.user = null
                this.initialized = true

                return true
            } catch (e: any) {
                if (e?.status === 422) {
                    this.errors = this.normalizeErrors(e.data?.errors)
                    return false
                }

                alert.add(
                    'error',
                    e?.data?.message || 'Регистрация не удалась.',
                )

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
                const data: any = await api.logout()

                alert.add('success', data?.message || 'Вы вышли из аккаунта.')

                this.logoutLocal()

                return true
            } catch (e: any) {
                alert.add('error', e?.data?.message || 'Ошибка выхода.')

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

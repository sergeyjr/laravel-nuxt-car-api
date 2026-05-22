import {defineStore} from 'pinia'

import type {User} from '~/types/auth'

import {useAuthApi} from '~/services/api/auth.api'
import {useAlertStore} from './alert'

export const useAuthStore = defineStore('auth', {

    state: () => ({
        user: null as User | null,

        initialized: false,
        initializing: false,
        initPromise: null as Promise<boolean> | null,

        loading: false,
        loggingOut: false,

        errors: {} as Record<string, string>,
    }),

    getters: {
        isAuth: state => !!state.user,
    },

    actions: {

        /* -----------------------------
           helpers
        ------------------------------*/

        showAlert(type: string, message: string) {
            useAlertStore().add(type, message)
        },

        t(key?: string) {
            const {$i18n} = useNuxtApp()
            if (!key) {
                return $i18n.t('common.error')
            }
            return $i18n.t(key)
        },

        resolveMessage(data: any, fallbackKey: string) {
            const messageKey = data?.message || fallbackKey
            return this.t(messageKey)
        },

        resetErrors() {
            this.errors = {}
        },

        setError(field: string, message: string) {
            this.errors[field] = message
        },

        logoutLocal() {
            this.user = null
            this.initialized = true
        },

        /* -----------------------------
           auth state
        ------------------------------*/

        async fetchUser() {
            debugLog('[Auth Store] fetchUser')

            const api = useAuthApi()

            try {
                const user = await api.me()

                this.user = user || null

                return !!user
            } catch (e: any) {

                if ([401, 403, 419].includes(e?.status)) {
                    this.user = null
                    return false
                }

                console.error(e)

                return false
            }
        },

        async initAuth() {
            debugLog('[Auth Store] initAuth')

            if (this.initialized) {
                return this.isAuth
            }

            if (this.initPromise) {
                return this.initPromise
            }

            this.initializing = true

            this.initPromise = (async () => {
                try {
                    const ok = await this.fetchUser()

                    this.initialized = true

                    return ok
                } finally {
                    this.initializing = false
                    this.initPromise = null
                }
            })()

            return this.initPromise
        },

        /* -----------------------------
           login
        ------------------------------*/

        async login(email: string, password: string) {
            debugLog('[Auth Store] login')

            this.loading = true

            this.resetErrors()

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

                this.showAlert(
                    'success',
                    this.resolveMessage(data, 'auth.loginSuccess')
                )

                return true
            } catch (e: any) {
                const data =
                    e?.data ||
                    e?.response?._data ||
                    e?.response?.data ||
                    {}

                if (e?.status === 422 && data?.errors) {
                    Object.entries(data.errors).forEach(([k, v]: any) => {
                        this.setError(k, Array.isArray(v) ? v[0] : String(v ?? ''))
                    })
                } else {
                    this.showAlert(
                        'error',
                        this.resolveMessage(data, 'common.error')
                    )
                }

                return false
            } finally {
                this.loading = false
            }
        },

        /* -----------------------------
           register
        ------------------------------*/

        async register(payload: any) {
            debugLog('[Auth Store] register')

            this.loading = true

            this.resetErrors()

            const api = useAuthApi()

            try {
                await api.csrf()

                const data: any = await api.register(
                    payload,
                )

                this.user = null
                this.initialized = true

                this.showAlert(
                    'success',
                    this.resolveMessage(data, 'auth.registerSuccess')
                )

                return true
            } catch (e: any) {

                const data =
                    e?.data ||
                    e?.response?._data ||
                    e?.response?.data ||
                    {}

                if (e?.status === 422 && data?.errors) {
                    Object.entries(data.errors).forEach(([k, v]: any) => {
                        this.setError(k, Array.isArray(v) ? v[0] : String(v ?? ''))
                    })
                } else {
                    this.showAlert(
                        'error',
                        this.resolveMessage(data, 'common.error')
                    )
                }

                return false

            } finally {
                this.loading = false
            }
        },

        /* -----------------------------
           logout
        ------------------------------*/

        async logout() {
            debugLog('[Auth Store] logout')

            if (this.loggingOut) {
                return false
            }

            this.loggingOut = true

            const api = useAuthApi()

            try {
                const data: any = await api.logout()

                this.showAlert(
                    'success',
                    this.resolveMessage(data, 'auth.logoutSuccess')
                )

                this.logoutLocal()

                return true
            } catch (e: any) {

                const data =
                    e?.data ||
                    e?.response?._data ||
                    e?.response?.data ||
                    {}

                this.showAlert(
                    'error',
                    this.resolveMessage(data, 'common.error')
                )

                console.error(e)

                return false
            } finally {
                this.loggingOut = false
            }
        }

    }

})

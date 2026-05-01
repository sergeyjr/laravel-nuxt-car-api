import {defineStore} from 'pinia'
import {useAlertStore} from './alert'
import {authApi} from '~/services/api/auth.api'
import {debugLog} from '~/utils/debug'

const TOKEN_KEY = 'web_session_token'

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
        isAuth: (state) => {
            const result = !!state.user
            debugLog('[auth] isAuth getter:', result)
            return result
        }
    },

    actions: {

        resetMessages() {
            debugLog('[auth] resetMessages')
            this.error = null
            this.errors = {}
            this.success = null
        },

        getCookie() {
            return useCookie<string | null>('web_session_token', {
                path: '/',
                sameSite: 'lax',
                default: () => null
            })
        },

        getToken() {
            const token = this.getCookie().value
            debugLog('[auth] getToken:', token)
            return token
        },

        setToken(token: string | null) {
            debugLog('[auth] setToken:', token)
            this.getCookie().value = token
        },

        clearToken() {
            debugLog('[auth] clearToken')
            this.getCookie().value = null
        },

        clearErrors() {
            debugLog('[auth] clearErrors')
            this.errors = {}
        },

        logoutLocal() {
            debugLog('[auth] logoutLocal')
            this.user = null
            this.clearToken()
            this.initialized = true
        },

        async fetchUser() {
            debugLog('[auth] fetchUser start')

            if (import.meta.server) {
                debugLog('[auth] fetchUser skipped on server')
                return false
            }

            try {
                const data: any = await authApi.me()
                debugLog('[auth] fetchUser success:', data)

                this.user = data.user
                return true

            } catch (e: any) {
                debugLog('[auth] fetchUser error:', e)

                this.user = null

                if (e?.status === 401) {
                    debugLog('[auth] fetchUser 401 -> clearToken')
                    this.clearToken()
                }

                return false

            } finally {
                debugLog('[auth] fetchUser end')
            }
        },

        async initAuth() {
            debugLog('[auth] initAuth start')

            if (this.initialized) {
                debugLog('[auth] initAuth already initialized:', this.isAuth)
                return this.isAuth
            }

            this.initialized = true

            const token = this.getToken()

            if (!token) {
                debugLog('[auth] initAuth no token')
                this.user = null
                this.initialized = true
                return false
            }

            try {
                const result = await this.fetchUser()
                debugLog('[auth] initAuth fetchUser result:', result)
                return this.isAuth

            } catch (e) {
                debugLog('[auth] initAuth error:', e)
                this.user = null
                return false

            } finally {
                this.initialized = true
                debugLog('[auth] initAuth finished')
            }
        },

        async register(payload: any) {
            debugLog('[auth] register payload:', payload)

            this.loading = true
            this.resetMessages()

            const alertStore = useAlertStore()

            try {
                const res = await authApi.register(payload)
                debugLog('[auth] register success:', res)

                this.user = null
                alertStore.add('success', 'Успешная регистрация')

                return true

            } catch (e: any) {
                debugLog('[auth] register error:', e)

                if (e?.status === 422) {
                    this.errors = e.data?.errors || {}
                } else {
                    this.error = e.data?.message || 'Ошибка регистрации'
                }
                return false

            } finally {
                this.loading = false
                debugLog('[auth] register end')
            }
        },

        async login(email: string, password: string) {
            debugLog('[auth] login start:', { email })

            this.loading = true
            this.resetMessages()

            try {
                const data: any = await authApi.login(email, password)
                debugLog('[auth] login response:', data)

                if (!data?.token) {
                    this.error = 'Нет токена'
                    return false
                }

                this.setToken(data.token)

                this.user = data.user
                this.initialized = true

                debugLog('[auth] login success user:', this.user)

                return true

            } catch (e: any) {
                debugLog('[auth] login error:', e)

                if (e?.status === 422) {
                    this.errors = e.data?.errors || {}
                } else {
                    this.error = e.data?.message || 'Ошибка авторизации'
                }

                return false

            } finally {
                this.loading = false
                debugLog('[auth] login end')
            }
        },

        async logout() {
            debugLog('[auth] logout start')

            this.loggingOut = true

            try {
                await authApi.logout()
                debugLog('[auth] logout api success')

            } catch (e) {
                debugLog('[auth] logout api error (ignored):', e)
            } finally {
                this.logoutLocal()
                this.loggingOut = false
                debugLog('[auth] logout finished')
            }
        }
    }
})

import {defineStore} from 'pinia'
import {useAuthApi} from '~/services/api/internal/auth.api'
import {useCookie} from '#app'
import {useAlertStore} from "~/stores/alert";

export const useAuthStore = defineStore('auth', {

    state: () => ({
        user: null as any,
        initialized: false,
        loading: false,
        error: null as string | null,
        errors: {} as Record<string, string>,
        success: null as string | null,
        token: null as string | null,
        loggingOut: false
    }),

    getters: {
        isAuth: (state) => !!state.user
    },

    actions: {

        getCookie() {
            return useCookie<string | null>('web_session_token', {
                path: '/',
                sameSite: 'lax',
                default: () => null
            })
        },

        getToken() {
            return this.token ?? useCookie<string | null>('web_session_token').value
        },

        setToken(token: string | null) {
            this.token = token
            useCookie<string | null>('web_session_token', {
                path: '/',
                sameSite: 'lax',
                default: () => null
            }).value = token
        },

        clearToken() {
            this.token = null
            useCookie<string | null>('web_session_token', {
                path: '/',
                sameSite: 'lax',
                default: () => null
            }).value = null
        },

        getToken2(): string | null {
            return this.getCookie().value
        },

        setToken2(token: string | null) {
            this.getCookie().value = token
        },

        clearToken2() {
            this.getCookie().value = null
        },

        showAlert(type: string, message: string) {
            useAlertStore().add(type, message)
        },

        clearErrors() {
            this.errors = {}
        },

        async fetchUser() {
            const api = useAuthApi()
            debugLog('fetchUser')
            try {
                const data: any = await api.me()
                debugLog('ME data', data)
                this.user = data
                return true
            } catch {
                this.user = null
                return false
            }
        },

        async initAuth() {
            debugLog('initAuth')
            if (this.initialized) return this.isAuth
            try {
                return await this.fetchUser()
            } catch (e) {
                this.user = null
                return false
            } finally {
                this.initialized = true
            }
        },

        async register(payload: any) {
            this.loading = true
            this.error = null
            this.errors = {}
            const api = useAuthApi()
            try {
                await api.register(payload)
                this.user = null
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
            this.error = null
            this.errors = {}
            const api = useAuthApi()
            try {
                //const data: any = await api.login(email, password)

                const webRes: any = await api.loginWeb(email, password)
                const tokenRes: any = await api.loginToken(email, password)

                if (tokenRes?.token) {
                    this.setToken(tokenRes.token)
                }

                this.user = webRes?.user ?? tokenRes?.user ?? null

                // if (data?.user) {
                //     this.user = data.user
                // } else {
                //     await this.fetchUser() // получаем юзера внутри через /me
                // }

                this.initialized = true
                return true
            } catch (e: any) {
                if (e?.status === 422) {
                    this.errors = e.data?.errors || {}
                } else {
                    this.error = e.data?.message || 'Ошибка авторизации'
                }
                const status = e?.status || e?.response?.status
                const message = e?.message || e?.data?.message
                const responseData = e?.response?._data || e?.data
                debugLog('[auth] login error details:', {
                    status,
                    message,
                    responseData,
                })
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
                debugLog('[auth] logout logoutLocal')
                this.logoutLocal()
                this.loggingOut = false
            }
        },

        logoutLocal() {
            debugLog('[auth] logoutLocal')
            this.clearToken()
            this.user = null
            this.initialized = true
        },

    }

})

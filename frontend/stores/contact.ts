import {defineStore} from 'pinia'

import {useContactApi} from '~/services/api/contact.api'
import {useAlertStore} from '~/stores/alert'

type ContactContext = 'home' | 'contactPage'

export const useContactStore = defineStore('contact', {

    state: () => ({
        form: {
            name: '',
            email: '',
            subject: '',
            body: '',
        },
        errors: {} as Record<string, string>,
        loading: false,
        retryAfter: 0,
        retryUntil: 0,
        timer: null as ReturnType<typeof setInterval> | null,
        successCountdown: null as number | null,
        contexts: {
            home: {
                successMessage: '',
                errorMessage: '',
            },
            contactPage: {
                successMessage: '',
                errorMessage: '',
            },
        } as Record<ContactContext, { successMessage: string; errorMessage: string }>,
    }),

    actions: {

        showAlert(type: string, message: string) {
            useAlertStore().add(type, message)
        },

        t(key?: string, params: Record<string, any> = {}) {
            const {$i18n} = useNuxtApp()
            if (!key) {
                return String($i18n.t('common.error', params))
            }
            return String($i18n.t(key, params))
        },

        resolveMessage(data: any, fallbackKey: string, params: Record<string, any> = {}) {
            const messageKey = data?.message || fallbackKey
            return this.t(messageKey, params)
        },

        stopCountdown() {
            if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
            }
        },

        getRetryCookie() {
            return useCookie<number>('contact_retry_until', {
                default: () => 0,
                sameSite: 'lax',
                maxAge: 60,
            })
        },

        restoreRetryState() {
            const retryCookie = this.getRetryCookie()
            const retryUntil = Number(retryCookie.value || 0)

            if (!retryUntil || retryUntil <= Date.now()) {
                this.retryAfter = 0
                this.retryUntil = 0
                this.successCountdown = null
                retryCookie.value = 0
                this.stopCountdown()
                return
            }

            this.retryUntil = retryUntil
            this.retryAfter = Math.ceil((retryUntil - Date.now()) / 1000)
            this.successCountdown = this.retryAfter
        },

        resetForm() {
            this.form = {
                name: '',
                email: '',
                subject: '',
                body: '',
            }
            this.errors = {}
        },

        resetMessages(context: ContactContext) {
            this.contexts[context].successMessage = ''
            this.contexts[context].errorMessage = ''
        },

        resetErrors() {
            this.errors = {}
        },

        setError(field: string, message: string) {
            this.errors[field] = message
        },

        setRetryAfter(seconds: number) {
            const retryCookie = this.getRetryCookie()

            this.retryAfter = Math.max(0, Number(seconds) || 0)

            this.retryUntil = this.retryAfter > 0
                ? Date.now() + (this.retryAfter * 1000)
                : 0

            this.successCountdown = this.retryAfter > 0
                ? this.retryAfter
                : null

            retryCookie.value = this.retryUntil
        },

        startCountdown() {
            this.stopCountdown()

            if (this.retryUntil <= 0) {
                this.retryAfter = 0
                this.retryUntil = 0
                this.successCountdown = null
                return
            }

            const sync = () => {
                const remainingMs = this.retryUntil - Date.now()

                if (remainingMs > 0) {
                    this.retryAfter = Math.ceil(remainingMs / 1000)
                    this.successCountdown = this.retryAfter
                    return
                }

                const retryCookie = this.getRetryCookie()

                this.retryAfter = 0
                this.retryUntil = 0
                this.successCountdown = null

                retryCookie.value = 0

                this.stopCountdown()
            }

            sync()

            this.timer = setInterval(() => {
                sync()
            }, 1000)
        },

        async submit(context: ContactContext = 'home') {
            const contactApi = useContactApi()

            this.loading = true
            this.resetErrors()
            this.resetMessages(context)

            try {
                const data: any = await contactApi.submit(this.form)

                this.resetForm()

                const retryAfter = Number(data?.retry_after || 0)

                this.setRetryAfter(retryAfter)

                if (this.retryAfter > 0 && import.meta.client) {
                    this.startCountdown()
                }

                const message = this.resolveMessage(
                    data,
                    'contact.sent',
                    {sec: this.retryAfter},
                )

                this.contexts[context].successMessage = message
                this.showAlert('success', message)
            } catch (e: any) {
                const status = e?.status
                const data = e?.data || e?.response?._data || e?.response?.data || {}

                if (status === 422 && data?.errors) {
                    Object.entries(data.errors).forEach(([k, v]: any) => {
                        this.setError(k, v[0])
                    })
                } else {
                    this.showAlert(
                        'error',
                        this.resolveMessage(data, 'common.error')
                    )
                }

                if (status === 429) {
                    this.setRetryAfter(Number(data?.retry_after || 0))

                    if (import.meta.client) {
                        this.startCountdown()
                    }

                    const message = this.t(
                        data?.message || 'contact.tooManyRequests',
                        {sec: this.retryAfter},
                    )

                    this.showAlert('warning', message)
                    return
                }

                console.error(e)
            } finally {
                this.loading = false
            }
        }

    }

})

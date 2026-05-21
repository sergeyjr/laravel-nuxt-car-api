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

        resolveMessage(data: any, fallbackKey: string) {
            const messageKey = data?.message || fallbackKey
            return this.t(messageKey)
        },

        stopCountdown() {
            if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
            }
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

        startCountdown() {
            this.stopCountdown()

            this.timer = setInterval(() => {
                if (this.retryAfter > 0) {
                    this.retryAfter--
                    return
                }

                this.stopCountdown()
                this.retryAfter = 0
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

                const message = this.resolveMessage(data, 'contact.sent')

                this.contexts[context].successMessage = message
                this.showAlert('success', message)

                this.retryAfter = data?.retry_after ?? 60
                this.startCountdown()
            } catch (e: any) {

                const status = e?.status
                const data = e?.data || e?.response?._data || e?.response?.data || {}

                if (e?.status === 422 && data?.errors) { // Ошибка валидации
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
                    this.retryAfter = data?.retry_after ?? 60
                    this.startCountdown()

                    const message = this.t(
                        data?.message || 'contact.tooManyRequests',
                        {sec: this.retryAfter},
                    )

                    this.showAlert('warning', message)
                    return
                }

                // const message = this.resolveMessage(data, 'contact.error')
                //
                // this.contexts[context].errorMessage = message
                // this.showAlert('error', message)

                console.error(e)
            } finally {
                this.loading = false
            }
        },

    },

})

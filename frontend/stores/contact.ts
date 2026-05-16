import {defineStore} from 'pinia'
import {useContactApi} from '~/services/api/internal/contact.api'
import {useAlertStore} from '~/stores/alert'

type ContactContext = 'home' | 'contactPage'

export const useContactStore = defineStore('contact', {

    state: () => ({
        form: {name: '', email: '', subject: '', body: ''},
        errors: {} as Record<string, string>,
        loading: false,
        retryAfter: 0,
        timer: null as ReturnType<typeof setInterval> | null,
        successCountdown: null as number | null,
        contexts: {
            home: {successMessage: '', errorMessage: ''},
            contactPage: {successMessage: '', errorMessage: ''}
        } as Record<ContactContext, { successMessage: string; errorMessage: string }>
    }),

    actions: {

        showAlert(type: string, message: string) {
            useAlertStore().add(type, message)
        },

        stopCountdown() {
            if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
            }
        },

        resetErrors() {
            this.errors = {}
        },

        resetForm() {
            this.form = {name: '', email: '', subject: '', body: ''}
            this.errors = {}
        },

        resetMessages(context: ContactContext) {
            this.contexts[context].successMessage = ''
            this.contexts[context].errorMessage = ''
        },

        normalizeErrors(errors: any): Record<string, string> {
            return Object.fromEntries(
                Object.entries(errors || {}).map(([k, v]) => [
                    k,
                    Array.isArray(v) ? (v[0] ?? '') : String(v ?? ''),
                ]),
            )
        },

        startCountdown() {
            this.stopCountdown()

            this.timer = setInterval(() => {
                if (this.retryAfter > 0) {
                    this.retryAfter--
                } else {
                    this.stopCountdown()
                    this.retryAfter = 0
                }
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

                this.contexts[context].successMessage =
                    data?.message || 'Сообщение отправлено.'

                this.showAlert('success', this.contexts[context].successMessage)

                this.retryAfter = data?.retry_after ?? 60
                this.startCountdown()
            } catch (e: any) {
                const status = e?.status
                const data = e?.data

                if (status === 422) {
                    this.errors = this.normalizeErrors(data?.errors)
                    return
                }

                if (status === 429) {
                    this.retryAfter = data?.retry_after ?? 60
                    this.startCountdown()

                    this.showAlert('warning', `Подождите ${this.retryAfter} сек. перед следующим сообщением.`,)
                    return
                }

                this.contexts[context].errorMessage =
                    data?.message || 'Ошибка отправки формы.'

                this.showAlert('error', this.contexts[context].errorMessage)

                console.error(e)
            } finally {
                this.loading = false
            }
        }

    }

})

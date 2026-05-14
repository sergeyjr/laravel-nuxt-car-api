import {defineStore} from 'pinia'
import {useContactApi} from '~/services/api/internal/contact.api'
import {useAlertStore} from '~/stores/alert'

type ContactContext = 'home' | 'contactPage'

export const useContactStore = defineStore('contact', {

    state: () => ({
        form: {name: '', email: '', subject: '', body: ''},
        errors: {} as Record<string, string[]>,
        loading: false,
        retryAfter: null as number | null,
        timer: null as ReturnType<typeof setInterval> | null,
        successCountdown: null as number | null,
        contexts: {
            home: {successMessage: '', errorMessage: ''},
            contactPage: {successMessage: '', errorMessage: ''}
        } as Record<ContactContext, { successMessage: string; errorMessage: string }>
    }),

    actions: {

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

        startCountdown() {
            if (this.timer) clearInterval(this.timer)

            this.timer = setInterval(() => {
                if (this.retryAfter && this.retryAfter > 0) this.retryAfter--
                else {
                    if (this.timer) clearInterval(this.timer)
                    this.timer = null
                    this.retryAfter = null
                }
            }, 1000)
        },

        async submit(context: ContactContext = 'home') {
            const contactApi = useContactApi()
            const alert = useAlertStore()

            this.loading = true
            this.resetErrors()
            this.resetMessages(context)

            try {
                const data: any = await contactApi.submit(this.form)

                this.resetForm()

                this.contexts[context].successMessage =
                    data?.message || 'Сообщение отправлено.'

                alert.add('success', this.contexts[context].successMessage)

                console.log('data', data)

                this.retryAfter = data?.retry_after ?? 60
                this.startCountdown()
            } catch (e: any) {
                const status = e?.status
                const data = e?.data

                if (status === 422) {
                    this.errors = data?.errors || {}
                    return
                }

                if (status === 429) {
                    this.retryAfter = data?.retry_after ?? null
                    this.startCountdown()

                    alert.add(
                        'warning',
                        `Подождите ${this.retryAfter ?? ''} сек. перед следующим сообщением.`
                    )
                    return
                }

                this.contexts[context].errorMessage =
                    data?.message || 'Ошибка отправки формы.'

                alert.add('error', this.contexts[context].errorMessage)

                console.error(e)
            } finally {
                this.loading = false
            }
        }

    }

})

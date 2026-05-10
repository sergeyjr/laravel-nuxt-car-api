import {defineStore} from 'pinia'
import {useContactApi} from '~/services/api/internal/contact.api'
import {useAlertStore} from '~/stores/alert'

type ContactContext = 'home' | 'contactPage'

export const useContactStore = defineStore('contact', {

    state: () => ({
        form: {
            name: '',
            email: '',
            subject: '',
            body: ''
        },

        errors: {} as Record<string, string[]>,

        loading: false,

        retryAfter: null as number | null,
        timer: null as ReturnType<typeof setInterval> | null,
        successCountdown: null as number | null
    }),

    actions: {

        resetErrors() {
            this.errors = {}
        },

        resetForm() {
            this.form = {
                name: '',
                email: '',
                subject: '',
                body: ''
            }
            this.errors = {}
        },

        startCountdown() {
            if (this.timer) clearInterval(this.timer)

            this.timer = setInterval(() => {
                if (this.retryAfter && this.retryAfter > 0) {
                    this.retryAfter--
                } else {
                    if (this.timer) clearInterval(this.timer)
                    this.timer = null
                }
            }, 1000)
        },

        startSuccessCountdown() {
            if (!this.retryAfter) return

            this.successCountdown = this.retryAfter

            if (this.timer) clearInterval(this.timer)

            this.timer = setInterval(() => {
                if (this.successCountdown && this.successCountdown > 0) {
                    this.successCountdown--
                } else {
                    if (this.timer) clearInterval(this.timer)
                    this.timer = null
                    this.successCountdown = null
                }
            }, 1000)
        },

        async submit(context: ContactContext = 'home') {

            const contactApi = useContactApi()
            const alert = useAlertStore()

            this.loading = true
            this.resetErrors()

            try {

                const data: any = await contactApi.submit(this.form)

                this.resetForm()

                const message = data?.message || 'Сообщение отправлено'

                alert.add('success', message)

                this.startSuccessCountdown()

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
                        `Подождите ${this.retryAfter ?? ''} сек перед следующим сообщением`
                    )

                    return
                }

                const message =
                    data?.message || 'Ошибка отправки формы'

                alert.add('error', message)

            } finally {
                this.loading = false
            }
        }

    }

})

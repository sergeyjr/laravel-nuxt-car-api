import {defineStore} from 'pinia'

type ContactContext = 'home' | 'contactPage'

export const useContactStore = defineStore('contact', {
    state: () => ({
        form: {
            name: '',
            email: '',
            subject: '',
            body: ''
        },

        errors: {} as Record<string, string>,
        loading: false,

        retryAfter: null as number | null,
        timer: null as ReturnType<typeof setInterval> | null,

        contexts: {
            home: {
                successMessage: '',
                errorMessage: ''
            },
            contactPage: {
                successMessage: '',
                errorMessage: ''
            }
        } as Record<ContactContext, {
            successMessage: string
            errorMessage: string
        }>
    }),

    actions: {
        getApi() {
            return useNuxtApp().$api
        },

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

        resetMessages(context: ContactContext) {
            this.contexts[context].successMessage = ''
            this.contexts[context].errorMessage = ''
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

        async submit(context: ContactContext = 'home') {
            const api = this.getApi()

            this.loading = true
            this.resetErrors()
            this.resetMessages(context)

            try {
                await api.get('/sanctum/csrf-cookie')

                const {data} = await api.post('/api/contact', this.form)

                this.resetForm()

                this.contexts[context].successMessage =
                    data?.message || 'Сообщение отправлено'

            } catch (e: any) {
                const status = e?.response?.status

                if (status === 422) {
                    this.errors = e.response.data?.errors || {}
                    return
                }

                if (status === 429) {
                    this.retryAfter = e.response.data?.retry_after ?? null
                    this.startCountdown()
                    return
                }

                this.contexts[context].errorMessage =
                    'Ошибка отправки формы'

                console.error('Contact error:', e)

            } finally {
                this.loading = false
            }
        }
    }
})

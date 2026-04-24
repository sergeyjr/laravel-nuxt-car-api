import {defineStore} from 'pinia'
import {api} from '@/api'
import {useAlertStore} from '@/stores/alertStore'

export const useContactStore = defineStore('contact', {

    state: () => ({

        form: {
            name: '',
            email: '',
            subject: '',
            body: ''
        },

        errors: {},

        loading: false,
        success: false,

        retryAfter: null,
        timer: null
    }),

    actions: {

        resetErrors() {
            this.errors = {
                name: '',
                email: '',
                subject: '',
                body: ''
            }
        },

        resetForm() {
            this.form = {
                name: '',
                email: '',
                subject: '',
                body: ''
            }
            this.errors = {}
            this.success = false
        },

        startCountdown() {
            if (this.timer) clearInterval(this.timer)

            this.timer = setInterval(() => {
                if (this.retryAfter > 0) {
                    this.retryAfter--
                } else {
                    clearInterval(this.timer)
                    this.timer = null
                }
            }, 1000)
        },

        async submit() {

            this.loading = true
            this.success = false
            this.resetErrors()

            const alertStore = useAlertStore()

            try {

                await api.get('/sanctum/csrf-cookie')
                const {data} = await api.post('/api/contact', this.form)

                this.resetForm()

                this.success = true

                alertStore.add('success', data.message || 'Сообщение отправлено успешно')

            } catch (e) {

                if (e.response?.status === 422) {
                    this.errors = e.response.data.errors || {}
                    return
                }

                if (e.response?.status === 429) {
                    this.retryAfter = e.response.data?.retry_after ?? null
                    this.startCountdown()
                    return
                }

                alertStore.add('error', 'Произошла ошибка при отправке формы')
                console.error('error:', e)

            } finally {
                this.loading = false
            }
        }

    }

})

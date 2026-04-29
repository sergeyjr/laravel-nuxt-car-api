import { defineStore } from 'pinia'
import { useAlertStore } from './alert'
import { useAuthStore } from './auth'

export const useCarFormStore = defineStore('carForm', {
    state: () => ({
        form: {
            title: '',
            description: '',
            price: null as number | null,
            photo_url: '',
            contacts: '',
            brand: '',
            model: '',
            year: null as number | null,
            body: '',
            mileage: null as number | null
        },

        errors: {} as Record<string, string>,
        submitting: false,
        generating: false
    }),

    actions: {
        // --- utils ---
        showAlert(type: string, message: string) {
            useAlertStore().add(type, message)
        },

        getApi() {
            return useNuxtApp().$api
        },

        reset() {
            this.form = {
                title: '',
                description: '',
                price: null,
                photo_url: '',
                contacts: '',
                brand: '',
                model: '',
                year: null,
                body: '',
                mileage: null
            }
            this.errors = {}
        },

        setError(field: string, message: string) {
            this.errors[field] = message
        },

        clearErrors() {
            this.errors = {}
        },

        // --- validation ---
        validateOptions() {
            const f = this.form

            const hasAny =
                f.brand || f.model || f.year || f.body || f.mileage

            if (!hasAny) return []

            const missing: string[] = []

            if (!f.brand) missing.push('brand')
            if (!f.model) missing.push('model')
            if (!f.year) missing.push('year')
            if (!f.body) missing.push('body')
            if (!f.mileage) missing.push('mileage')

            return missing
        },

        // --- submit ---
        async submit() {
            const api = this.getApi()
            const auth = useAuthStore()

            this.clearErrors()

            const missing = this.validateOptions()

            if (missing.length) {
                missing.forEach(f => this.setError(f, 'Это поле обязательно'))
                this.showAlert('danger', 'Заполните все опции автомобиля')
                return
            }

            this.submitting = true

            try {
                const isAuth = await auth.initAuth()

                if (!isAuth) {
                    this.showAlert('danger', 'Требуется авторизация')
                    return
                }

                const data: any = await api.post('/api/v1/car/create', {
                    ...this.form,
                    options: {
                        brand: this.form.brand,
                        model: this.form.model,
                        year: this.form.year,
                        body: this.form.body,
                        mileage: this.form.mileage
                    }
                })

                this.showAlert(
                    'success',
                    data.message || `Создано! ID: ${data.data.id}`
                )

                this.reset()

                return data

            } catch (e: any) {
                const status = e?.status
                const data = e?.data

                if (status === 401) {
                    auth.clearToken?.()
                    this.showAlert('danger', 'Сессия истекла')
                    return
                }

                if (status === 422) {
                    this.showAlert('error', data?.message || 'Ошибка валидации')

                    if (data?.errors) {
                        Object.keys(data.errors).forEach(f => {
                            this.setError(f, data.errors[f][0])
                        })
                    }

                } else {
                    this.showAlert('error', data?.message || 'Ошибка сервера')
                }

            } finally {
                this.submitting = false
            }
        },

        // --- generate ---
        async generate() {
            const api = this.getApi()
            const auth = useAuthStore()

            this.generating = true

            try {
                const isAuth = await auth.initAuth()

                if (!isAuth) {
                    this.showAlert('danger', 'Требуется авторизация')
                    return
                }

                const data: any = await api('/api/v1/car/generate-mock')

                const car = data.data

                Object.assign(this.form, {
                    title: car.title,
                    description: car.description,
                    price: car.price,
                    photo_url: car.photo_url,
                    contacts: car.contacts,
                    brand: car.options?.brand,
                    model: car.options?.model,
                    year: car.options?.year,
                    body: car.options?.body,
                    mileage: car.options?.mileage
                })

            } catch (e: any) {
                console.log('GEN ERROR:', e?.data)
                this.showAlert('error', 'Ошибка генерации данных')
            } finally {
                this.generating = false
            }
        }
    }
})

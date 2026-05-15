import {useCarV1Api} from '~/services/api/external/v1/car.api'
import {defineStore} from 'pinia'
import {useAlertStore} from './alert'
import {useAuthStore} from './auth'

type CarForm = {
    title: string
    description: string
    price: string | number
    photo_url: string
    contacts: string
    brand: string
    model: string
    year: string | number
    body: string
    mileage: string | number
}

export const useCarV1Store = defineStore('car', {
    state: () => ({
        form: {
            title: '',
            description: '',
            price: '',
            photo_url: '',
            contacts: '',
            brand: '',
            model: '',
            year: '',
            body: '',
            mileage: ''
        } as CarForm,

        errors: {} as Record<string, string>,
        submitting: false,
        generating: false
    }),

    actions: {

        validateOptions() {
            const f = this.form
            const required = ['brand', 'model', 'year', 'body', 'mileage'] as const

            const hasAny = f.brand || f.model || f.year || f.body || f.mileage
            if (!hasAny) return []

            return required.filter(k => !f[k])
        },

        reset() {
            this.form = {
                title: '',
                description: '',
                price: '',
                photo_url: '',
                contacts: '',
                brand: '',
                model: '',
                year: '',
                body: '',
                mileage: ''
            }
            this.errors = {}
        },

        showAlert(type: string, message: string) {
            useAlertStore().add(type, message)
        },

        clearErrors() {
            this.errors = {}
        },

        setError(field: string, message: string) {
            this.errors[field] = message
        },

        async submit() {
            this.clearErrors()

            const auth = useAuthStore()
            const missing = this.validateOptions()
            const carV1Api = useCarV1Api()

            if (missing.length) {
                missing.forEach(f => this.setError(f, 'Обязательно'))
                this.showAlert('danger', 'Заполните опции автомобиля')
                return null
            }

            if (!auth.isAuth) {
                this.showAlert('danger', 'Требуется авторизация')
                return null
            }

            this.submitting = true

            try {
                const payload = {
                    ...this.form,
                    price: Number(this.form.price),
                    year: Number(this.form.year),
                    mileage: Number(this.form.mileage),
                    options: {
                        brand: this.form.brand,
                        model: this.form.model,
                        year: Number(this.form.year),
                        body: this.form.body,
                        mileage: Number(this.form.mileage)
                    }
                }

                const res: any = await carV1Api.create(payload)

                this.showAlert('success', res.message || `Создано ID: ${res.data.id}`)
                this.reset()

                return res.data
            } catch (e: any) {
                const status = e?.status
                const data = e?.data

                if (status === 401) {
                    debugLog('[auth] logout v1 401')
                    auth.logoutLocal()
                    this.showAlert('danger', 'Сессия истекла')
                    return null
                }

                if (status === 422) {
                    this.showAlert('error', data?.message || 'Ошибка валидации')

                    if (data?.errors) {
                        Object.entries(data.errors).forEach(([k, v]: any) => {
                            this.setError(k, v[0])
                        })
                    }
                } else {
                    this.showAlert('error', data?.message || 'Ошибка сервера')
                }

                return null
            } finally {
                this.submitting = false
            }
        },

        async generate() {
            this.generating = true

            const carV1Api = useCarV1Api()

            try {
                const res: any = await carV1Api.generateMock()
                const car = res.data

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
            } catch {
                this.showAlert('error', 'Ошибка генерации данных')
            } finally {
                this.generating = false
            }
        }

    }

})

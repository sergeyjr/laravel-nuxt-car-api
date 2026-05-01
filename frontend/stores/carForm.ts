import {defineStore} from 'pinia'
import {carApi} from '~/services/api/car.api'
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

export const useCarFormStore = defineStore('carForm', {
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

        showAlert(type: string, message: string) {
            useAlertStore().add(type, message)
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

        setError(field: string, message: string) {
            this.errors[field] = message
        },

        clearErrors() {
            this.errors = {}
        },

        validateOptions() {
            const f = this.form

            const required = ['brand', 'model', 'year', 'body', 'mileage'] as const
            const missing: string[] = []

            const hasAny = f.brand || f.model || f.year || f.body || f.mileage

            if (!hasAny) return []

            required.forEach((k) => {
                if (!f[k]) missing.push(k)
            })

            return missing
        },

        async submit() {
            const auth = useAuthStore()

            this.clearErrors()

            const missing = this.validateOptions()

            if (missing.length) {
                missing.forEach(f => this.setError(f, 'Это поле обязательно'))
                this.showAlert('danger', 'Заполните все опции автомобиля')
                return null
            }

            this.submitting = true

            try {
                const auth = useAuthStore()

                if (!auth.isAuth) {
                    this.showAlert('danger', 'Требуется авторизация')
                    return null
                }

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

                const res = await carApi.create(payload)

                this.showAlert(
                    'success',
                    res.message || `Создано! ID: ${res.data.id}`
                )

                this.reset()

                return res.data

            } catch (e: any) {

                const status = e?.status
                const data = e?.data

                if (status === 401) {
                    auth.clearToken?.()
                    this.showAlert('danger', 'Сессия истекла')
                    return null
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

                return null

            } finally {
                this.submitting = false
            }
        },

        async generate() {
            this.generating = true

            try {
                const res = await carApi.generateMock()
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

            } catch (e) {
                console.error(e)
                this.showAlert('error', 'Ошибка генерации данных')

            } finally {
                this.generating = false
            }
        }
    }
})

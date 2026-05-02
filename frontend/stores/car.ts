import { defineStore } from 'pinia'
import { carApi } from '~/services/api/internal/car.api'
import { carV1Api } from '~/services/api/external/v1/car.api'
import { useAlertStore } from './alert'
import { useAuthStore } from './auth'
import type { Car, CarsResponse } from '~/types/car'

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

export const useCarStore = defineStore('car', {
    state: () => ({
        cars: [] as Car[],
        meta: null as CarsResponse | null,
        car: null as Car | null,
        latest: [] as Car[],

        loading: false,
        carLoading: false,
        latestLoading: false,

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

        clearErrors() {
            this.errors = {}
        },

        setError(field: string, message: string) {
            this.errors[field] = message
        },

        async fetch(page = 1) {
            this.loading = true
            try {
                const res = await carApi.fetchCars(page)
                this.cars = res.data || []
                this.meta = res
            } catch {
                this.cars = []
                this.meta = null
            } finally {
                this.loading = false
            }
        },

        async fetchCar(id: number) {
            if (!id) return
            this.carLoading = true
            this.car = null

            try {
                this.car = await carApi.fetchCar(id)
            } catch {
                this.car = null
            } finally {
                this.carLoading = false
            }
        },

        async fetchLatest() {
            this.latestLoading = true

            try {
                this.latest = await carApi.fetchLatest()
            } catch {
                this.latest = []
            } finally {
                this.latestLoading = false
            }
        },

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

        async submit() {
            this.clearErrors()

            const auth = useAuthStore()
            const missing = this.validateOptions()

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

                const res = await carV1Api.create(payload)

                this.showAlert('success', res.message || `Создано ID: ${res.data.id}`)
                this.reset()

                return res.data

            } catch (e: any) {

                const status = e?.status
                const data = e?.data

                if (status === 401) {
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

            try {
                const res = await carV1Api.generateMock()
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

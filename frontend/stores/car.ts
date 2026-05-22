import {defineStore} from 'pinia'
import type {Car, CarsResponse} from '~/types/car'
import {useCartStore} from '~/stores/cart'
import {useCarApi} from '~/services/api/car.api'
import {useAuthApi} from "~/services/api/auth.api";
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

const defaultForm = (): CarForm => ({
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
})

export const useCarStore = defineStore('car', {

    state: () => ({
        cars: [] as Car[],
        meta: null as CarsResponse | null,
        carsById: {} as Record<number, Car>,
        carLoading: {} as Record<number, boolean>,
        latest: [] as Car[],
        adding: {} as Record<number, boolean>,
        listLoading: false,
        latestLoading: false,
        force: false,
        latestLoaded: false,
        pages: {} as Record<string, { cars: Car[]; meta: CarsResponse }>,
        form: defaultForm(),
        errors: {} as Record<string, string>,
        submitting: false,
        generating: false,
    }),

    getters: {

        isAdding: (state) => (id: number | string) => !!state.adding[Number(id)],

        hasPage: (state) => (page: number | string) => !!state.pages[Number(page)],

        getCar: (state) => (id: number | string) =>
            state.carsById[Number(id)] || null,

        isCarLoading: (state) => (id: number | string) =>
            !!state.carLoading[Number(id)],

    },

    actions: {

        validateOptions() {
            const f = this.form
            const required = ['brand', 'model', 'year', 'body', 'mileage'] as const

            const hasAny = f.brand || f.model || f.year || f.body || f.mileage
            if (!hasAny) return []

            return required.filter(k => !f[k])
        },

        reset() {
            this.form = defaultForm()
            this.errors = {}
            this.submitting = false
            this.generating = false
        },

        showAlert(type: string, message: string) {
            useAlertStore().add(type, message)
        },

        resetErrors() {
            this.errors = {}
        },

        setError(field: string, message: string) {
            this.errors[field] = message
        },

        t(key?: string) {
            const {$i18n} = useNuxtApp()
            if (!key) {
                return $i18n.t('common.error')
            }
            return $i18n.t(key)
        },

        resolveMessage(data: any, fallbackKey: string) {
            const messageKey = data?.message || fallbackKey
            return this.t(messageKey)
        },

        async fetch(page = 1, sort = '-id') {
            const p = Number(page) || 1
            const s = String(sort || '-id')
            const key = `${p}:${s}`

            const cached = this.pages[key]
            if (cached) {
                this.cars = cached.cars
                this.meta = cached.meta
                return cached.meta
            }

            this.listLoading = true

            const api = useCarApi()

            try {
                const res = await api.fetchCars(p, s)
                this.cars = res.data || []
                this.meta = res
                this.pages[key] = {
                    cars: this.cars,
                    meta: res,
                }
                return res
            } catch {
                this.cars = []
                this.meta = null
                return null
            } finally {
                this.listLoading = false
            }
        },

        async fetchCar(id: number, force = false) {

            id = Number(id)

            if (!id) {
                return null
            }

            if (this.carsById[id] && !force) {
                return this.carsById[id]
            }

            if (this.carLoading[id]) {
                return this.carsById[id] || null
            }

            this.carLoading[id] = true

            const api = useCarApi()

            try {
                const car = await api.fetchCar(id)
                this.carsById[id] = car
                return car
            } catch {
                return null
            } finally {
                this.carLoading[id] = false
            }

        },

        async addToCart(car: Car) {

            const id = Number(car.id)
            if (!id) {
                return false
            }

            this.adding[id] = true

            try {
                await useCartStore().add({
                    id,
                    name: car.title,
                    price: car.price,
                    qty: 1,
                    photo_url: car.photo_url,
                })
                return true
            } catch (e) {
                console.error(e)
                return false
            } finally {
                this.adding[id] = false
            }

        },

        async fetchLatest() {

            if (this.latestLoaded && !this.force) {
                return this.latest
            }

            this.latestLoading = true

            const api = useCarApi()

            try {
                const res = await api.fetchLatest()
                this.latest = res.data || []
                this.latestLoaded = true
                return this.latest
            } catch {
                this.latest = []
                return []
            } finally {
                this.latestLoading = false
            }

        },

        async submitCreateCarForm() {
            this.resetErrors()

            const authStore = useAuthStore()

            const missing = this.validateOptions()

            if (missing.length) {
                missing.forEach(f => this.setError(f, 'Обязательно.'))
                this.showAlert('danger', 'Заполните опции автомобиля.')
                return null
            }

            const authApi = useAuthApi()
            const carApi = useCarApi()

            this.submitting = true

            try {

                await authApi.csrf()

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
                        mileage: Number(this.form.mileage),
                    },
                }

                const res: any = await carApi.createCar(payload)

                this.showAlert(
                    'success',
                    `${res.message || `Создано ID: ${res.id}`} — <a href="/catalog/show/${res.id}">открыть</a>`
                )

                this.reset()

                return res
            } catch (e: any) {
                const status = e?.status
                const data = e?.data

                if (status === 401) {
                    authStore.logoutLocal()
                    this.showAlert('danger', 'Сессия истекла.')
                    return null
                }

                if (status === 422) { // Ошибка валидации
                    if (data?.errors) {
                        Object.entries(data.errors).forEach(([k, v]: any) => {
                            this.setError(k, v[0])
                        })
                    }
                } else {
                    this.showAlert(
                        'error',
                        this.resolveMessage(data, 'common.error')
                    )                }

                return null
            } finally {
                this.submitting = false
            }
        },

        /**
         * Это тестовый метод, тч перевод не нужен
         */
        async generateCarForm() {
            this.generating = true

            const authApi = useAuthApi()
            const carApi = useCarApi()

            try {

                await authApi.csrf()

                const res: any = await carApi.generateCar()

                const car = res.data;

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
                    mileage: car.options?.mileage,
                })
            } catch {
                this.showAlert('error', 'Ошибка генерации данных.')
            } finally {
                this.generating = false
            }
        }

    }

})

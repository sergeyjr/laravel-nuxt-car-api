import {defineStore} from 'pinia'

import type {Car, CarsResponse} from '~/types/car'

import {useCartStore} from '~/stores/cart'

import {useCarApi} from '~/services/api/internal/car.api'

export const useCarStore = defineStore('car', {

    state: () => ({
        cars: [] as Car[],
        meta: null as CarsResponse | null,
        car: null as Car | null,
        pages: {} as Record<number, CarsResponse>,

        latest: [] as Car[],

        adding: {} as Record<number, boolean>,

        listLoading: false,
        carLoading: false,
        latestLoading: false,
    }),

    getters: {

        isAdding: (state) => (id: number | string) => {
            return !!state.adding[Number(id)]
        },

    },

    actions: {

        async fetch(page = 1) {

            if (this.pages[page]) {

                const cached = this.pages[page]

                this.cars = cached.data || []
                this.meta = cached

                return cached

            }

            this.listLoading = true

            const carApi = useCarApi()

            try {

                const res = await carApi.fetchCars(page)

                this.pages[page] = res

                this.cars = res.data || []
                this.meta = res

                return res

            } catch {

                this.cars = []
                this.meta = null

                return null

            } finally {

                this.listLoading = false

            }

        },

        async fetchCar(id: number) {

            if (!id) {
                this.car = null
                return null
            }

            if (
                this.car &&
                Number(this.car.id) === Number(id)
            ) {
                return this.car
            }

            this.carLoading = true

            const carApi = useCarApi()

            try {

                const car = await carApi.fetchCar(id)

                this.car = car

                return car

            } catch {

                this.car = null

                return null

            } finally {

                this.carLoading = false

            }

        },

        async addToCart(car: Car) {

            const id = Number(car.id)

            if (!id) {
                return false
            }

            this.adding[id] = true

            try {

                const cartStore = useCartStore()

                await cartStore.add({
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

            this.latestLoading = true

            const carApi = useCarApi()

            try {

                const res = await carApi.fetchLatest()

                this.latest = res.data || []

                return this.latest

            } catch {

                this.latest = []

                return []

            } finally {

                this.latestLoading = false

            }

        },

    },

})

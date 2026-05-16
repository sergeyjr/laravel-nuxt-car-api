import {defineStore} from 'pinia'
import type {Car, CarsResponse} from '~/types/car'
import {useCartStore} from '~/stores/cart'
import {useCarApi} from '~/services/api/internal/car.api'

export const useCarStore = defineStore('car', {

    state: () => ({
        cars: [] as Car[],
        meta: null as CarsResponse | null,
        car: null as Car | null,

        latest: [] as Car[],

        adding: {} as Record<number, boolean>,

        listLoading: false,
        carLoading: false,
        latestLoading: false,

        force: false,
        latestLoaded: false,
    }),

    getters: {
        isAdding: (state) => (id: number | string) => !!state.adding[Number(id)],
    },

    actions: {

        async fetch(page = 1) {

            this.listLoading = true

            const api = useCarApi()

            try {
                const res = await api.fetchCars(page)
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

            this.carLoading = true

            const api = useCarApi()

            try {
                const car = await api.fetchCar(id)
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

        }

    }

})

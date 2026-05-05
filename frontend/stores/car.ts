import type {Car, CarsResponse} from '~/types/car'
import {useCarApi} from '~/services/api/internal/car.api'
import {defineStore} from 'pinia'

export const useCarStore = defineStore('car', {
    state: () => ({
        cars: [] as Car[],
        meta: null as CarsResponse | null,
        car: null as Car | null,
        latest: [] as Car[],

        loading: false,
        carLoading: false,
        latestLoading: false,
    }),

    actions: {

        async fetch(page = 1) {
            this.loading = true

            const carApi = useCarApi()

            try {
                const res = await carApi.fetchCars(page)
                this.cars = res.data || []
                this.meta = res
                return res
            } catch {
                this.cars = []
                this.meta = null
                return null
            } finally {
                this.loading = false
            }
        },

        async fetchCar(id: number) {
            if (!id) return null

            this.carLoading = true
            this.car = null

            const carApi = useCarApi()

            try {
                this.car = await carApi.fetchCar(id)
                return this.car
            } catch {
                this.car = null
                return null
            } finally {
                this.carLoading = false
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
        }

    }

})

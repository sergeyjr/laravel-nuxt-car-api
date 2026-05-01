import { defineStore } from 'pinia'
import { carApi, type Car, type CarsResponse } from '~/services/api/car.api'

export const useCarStore = defineStore('cars', {
    state: () => ({
        cars: [] as Car[],
        meta: null as CarsResponse | null,

        loading: false,

        car: null as Car | null,
        carLoading: false,

        latest: [] as Car[],
        latestLoading: false
    }),

    actions: {

        async fetch(page = 1) {
            this.loading = true

            try {
                const res = await carApi.fetchCars(page)

                this.cars = res.data || []
                this.meta = res

            } catch (e) {
                console.error(e)
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

            } catch (e) {
                console.error(e)
                this.car = null
            } finally {
                this.carLoading = false
            }
        },

        async fetchLatest() {
            this.latestLoading = true

            try {
                this.latest = await carApi.fetchLatest()

            } catch (e) {
                console.error(e)
                this.latest = []
            } finally {
                this.latestLoading = false
            }
        }

    }
})

import {defineStore} from 'pinia'
import {useNuxtApp} from '#app'

interface Car {
    id: number
    [key: string]: any
}

interface CarsMeta {
    current_page: number
    last_page: number
    from: number | null
    to: number | null
    total: number
    per_page: number
}

interface CarsListResponse {
    data: Car[]
    current_page: number
    last_page: number
    from: number | null
    to: number | null
    total: number
    per_page: number
}

export const useCarStore = defineStore('cars', {
    state: () => ({
        cars: [] as Car[],
        meta: null as CarsMeta | null,
        loading: false,

        car: null as Car | null,
        carLoading: false,

        latest: [] as Car[],
        latestLoaded: false,
        latestLoading: false
    }),

    actions: {

        api() {
            return useNuxtApp().$api as any
        },

        async fetch(page = 1) {
            this.loading = true

            try {
                const res: CarsListResponse = await this.api()('/cars', {
                    query: { page }
                })

                this.cars = res.data || []

                this.meta = {
                    current_page: res.current_page,
                    last_page: res.last_page,
                    from: res.from,
                    to: res.to,
                    total: res.total,
                    per_page: res.per_page
                }

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
                this.car = await this.api()(`/cars/${id}`)

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
                const res = await this.api()('/cars/latest')

                // console.log('res', res)

                this.latest = Array.isArray(res) ? res : res.data || []

            } catch (e) {
                console.error(e)
                this.latest = []
            } finally {
                this.latestLoading = false
            }
        }
    }
})

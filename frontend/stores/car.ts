import { defineStore } from 'pinia'
import type { Car, CarsResponse } from '~/types/car'
import { useCarApi } from '~/services/api/internal/car.api'

type PageCache = {
    cars: Car[]
    meta: CarsResponse
}

export const useCarStore = defineStore('car', {

    state: () => ({
        cars: [] as Car[],
        meta: null as CarsResponse | null,
        car: null as Car | null,

        pages: {} as Record<number, PageCache>,

        latest: [] as Car[],
        latestFetchedAt: 0,
        latestCacheTtl: 1000 * 60 * 60,

        listLoading: false,
        carLoading: false,
        latestLoading: false,
    }),

    actions: {

        async fetch(page = 1, force = false) {
            const cached = this.pages[page]

            if (!force && cached) {
                this.cars = cached.cars
                this.meta = cached.meta
                return cached.meta
            }

            this.listLoading = true

            const carApi = useCarApi()

            try {
                const res = await carApi.fetchCars(page)

                const cars = res.data || []

                this.cars = cars
                this.meta = res

                this.pages[page] = {
                    cars,
                    meta: res
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

        async fetchCar(id: number) {
            if (!id) {
                this.car = null
                this.carLoading = false
                return null
            }

            this.carLoading = true
            this.car = null

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

        async fetchLatest(force = false) {
            const now = Date.now()

            const isCached =
                this.latest.length > 0 &&
                now - this.latestFetchedAt < this.latestCacheTtl

            if (!force && isCached) {
                return this.latest
            }

            this.latestLoading = true

            const carApi = useCarApi()

            try {
                const res = await carApi.fetchLatest()
                this.latest = res.data || []
                this.latestFetchedAt = Date.now()
                return this.latest
            } catch {
                this.latest = []
                return []
            } finally {
                this.latestLoading = false
            }
        },

        clearPagesCache() {
            this.pages = {}
        }

    }

})

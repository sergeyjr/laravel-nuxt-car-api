import type { Car, CarsResponse } from '~/types/car'
import { useCarApi } from '~/services/api/internal/car.api'
import { defineStore } from 'pinia'

function createDelayedLoader(
    show: () => void,
    hide: () => void,
    delay = 150
) {
    let visible = false

    const timer = setTimeout(() => {
        visible = true
        show()
    }, delay)

    return () => {
        clearTimeout(timer)

        if (visible) {
            hide()
        }
    }
}

export const useCarStore = defineStore('car', {
    state: () => ({
        cars: [] as Car[],
        meta: null as CarsResponse | null,
        car: null as Car | null,

        latest: [] as Car[],
        latestFetchedAt: 0,
        latestCacheTtl: 1000 * 60 * 60,

        loading: false,
        carLoading: false,
        latestLoading: false,

        carPending: false,
        loadingPending: false,
        latestPending: false,
    }),

    actions: {

        async fetch(page = 1) {
            this.loadingPending = true
            this.loading = false

            const stopLoading = createDelayedLoader(
                () => {
                    this.loading = true
                },
                () => {
                    this.loading = false
                }
            )

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
                this.loadingPending = false
                stopLoading()
            }
        },

        async fetchCar(id: number) {
            if (!id) {
                this.car = null
                this.carPending = false
                this.carLoading = false
                return null
            }

            this.carPending = true
            this.carLoading = false
            this.car = null

            const stopLoading = createDelayedLoader(
                () => {
                    this.carLoading = true
                },
                () => {
                    this.carLoading = false
                }
            )

            const carApi = useCarApi()

            try {
                const car = await carApi.fetchCar(id)
                this.car = car
                return car
            } catch {
                this.car = null
                return null
            } finally {
                this.carPending = false
                stopLoading()
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

            this.latestPending = true
            this.latestLoading = false

            const stopLoading = createDelayedLoader(
                () => {
                    this.latestLoading = true
                },
                () => {
                    this.latestLoading = false
                }
            )

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
                this.latestPending = false
                stopLoading()
            }
        }

    }

})

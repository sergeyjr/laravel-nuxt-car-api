import { defineStore } from 'pinia'
import { carsApi } from '~/services/api/cars.api'
import type { Car, CarsListResponse } from '~/services/api/cars.api'

interface CarsMeta {
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

        cache: new Map<number, { items: Car[]; meta: CarsMeta }>(),

        car: null as Car | null,
        carLoading: false,
        carCache: new Map<number, Car>(),

        latest: [] as Car[],
        latestLoaded: false,
        latestLoading: false
    }),

    actions: {
        // --- LIST ---
        async fetch(page = 1) {
            if (!page || page < 1) return

            if (this.cache.has(page)) {
                const cached = this.cache.get(page)!
                this.cars = cached.items
                this.meta = cached.meta
                return
            }

            this.loading = true

            try {
                const res: CarsListResponse = await carsApi.list(page)

                const items = Array.isArray(res.data) ? res.data : []

                const meta: CarsMeta = {
                    current_page: (res as any).current_page ?? 1,
                    last_page: (res as any).last_page ?? 1,
                    from: (res as any).from ?? null,
                    to: (res as any).to ?? null,
                    total: (res as any).total ?? 0,
                    per_page: (res as any).per_page ?? items.length
                }

                this.cars = items
                this.meta = meta

                this.cache.set(page, {
                    items,
                    meta: { ...meta }
                })
            } catch (e) {
                console.error('Ошибка загрузки машин:', e)
                this.cars = []
                this.meta = null
            } finally {
                this.loading = false
            }
        },

        // --- SINGLE ---
        async fetchCar(id: number) {
            if (!id) return

            if (this.carCache.has(id)) {
                this.car = this.carCache.get(id)!
                return
            }

            this.carLoading = true
            this.car = null

            try {
                const res = await carsApi.show(id)
console.log('res', res)
                const car = (res as any).data ?? res

                this.car = car
                this.carCache.set(id, car)
            } catch (e) {
                console.error('Ошибка загрузки машины:', e)
                this.car = null
            } finally {
                this.carLoading = false
            }
        },

        // --- LATEST ---
        async fetchLatest() {
            if (this.latestLoaded) return

            this.latestLoading = true

            try {
                const res = await carsApi.latest()

                this.latest = (res as any).data ?? res
                this.latestLoaded = true
            } catch (e) {
                console.error('Ошибка загрузки новинок:', e)
                this.latest = []
            } finally {
                this.latestLoading = false
            }
        }
    }
})

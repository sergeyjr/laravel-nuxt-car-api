import { defineStore } from 'pinia'

export const useCarStore = defineStore('cars', {
    state: () => ({
        cars: [] as any[],
        meta: null as any,
        loading: false,

        cache: new Map<number, any>(),

        car: null as any,
        carLoading: false,
        carCache: new Map<number, any>(),

        latest: [] as any[],
        latestLoaded: false,
        latestLoading: false
    }),

    actions: {
        getApi() {
            return useNuxtApp().$api
        },

        // --- LIST ---
        async fetch(page = 1) {
            if (!page || page < 1) return

            if (this.cache.has(page)) {
                const cached = this.cache.get(page)
                this.cars = cached.items
                this.meta = cached.meta
                return
            }

            const api = this.getApi()

            this.loading = true

            try {
                const { data } = await api.get('/api/cars', {
                    params: { page }
                })

                const items = Array.isArray(data.data) ? data.data : []

                const meta = {
                    current_page: data.current_page ?? 1,
                    last_page: data.last_page ?? 1,
                    from: data.from ?? null,
                    to: data.to ?? null,
                    total: data.total ?? 0,
                    per_page: data.per_page ?? items.length
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
                this.car = this.carCache.get(id)
                return
            }

            const api = this.getApi()

            this.carLoading = true
            this.car = null

            try {
                const { data } = await api.get(`/api/cars/${id}`)

                this.car = data.data
                this.carCache.set(id, data.data)

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

            const api = this.getApi()

            this.latestLoading = true

            try {
                const { data } = await api.get('/api/cars/latest')

                this.latest = data.data ?? data
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

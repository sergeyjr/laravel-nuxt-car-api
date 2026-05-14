import { defineStore } from 'pinia'
import type { Car, CarsResponse } from '~/types/car'
import { useCarApi } from '~/services/api/internal/car.api'

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
    }),

    getters: {
        isAdding: (state) => (id: number | string) => {
            return !!state.adding[Number(id)]
        },
        isInCart: () => (cartStore: any, carId: number | string) => {
            return !!cartStore.items[String(carId)]
        }
    },

    actions: {

        // async fetch(page = 1) {
        //     this.listLoading = true
        //     const carApi = useCarApi()
        //
        //     try {
        //         const res = await carApi.fetchCars(page)
        //
        //         this.cars = res.data || []
        //         this.meta = res
        //
        //         return res
        //     } catch {
        //         this.cars = []
        //         this.meta = null
        //         return null
        //     } finally {
        //         this.listLoading = false
        //     }
        // },

        // async fetchCar(id: number) {
        //     if (!id) {
        //         this.car = null
        //         return null
        //     }
        //
        //     this.carLoading = true
        //     const carApi = useCarApi()
        //
        //     try {
        //         const car = await carApi.fetchCar(id)
        //
        //         this.car = car
        //         return car
        //     } catch {
        //         this.car = null
        //         return null
        //     } finally {
        //         this.carLoading = false
        //     }
        // },

        async addToCart(car: Car) {
            const id = Number(car.id)
            if (!id) return
            this.adding[id] = true
            try {
                await new Promise(resolve => setTimeout(resolve, 300))
                return true
            } catch (e) {
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

    }

})

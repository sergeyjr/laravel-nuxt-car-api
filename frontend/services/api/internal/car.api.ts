import type {Car, CarsResponse} from '~/types/car'
import {useNuxtApp} from '#app'

function api() {
    return useNuxtApp().$api
}

export const carApi = {

    async fetchCar(id: number): Promise<Car> {
        return api()(`/cars/${id}`)
    },

    async fetchCars(page = 1): Promise<CarsResponse> {
        return api()('/cars', {
            query: {page}
        })
    },

    async fetchLatest(): Promise<Car[]> {
        const res: any = api()('/cars/latest')

        return Array.isArray(res)
            ? res
            : res?.data ?? []
    }

}

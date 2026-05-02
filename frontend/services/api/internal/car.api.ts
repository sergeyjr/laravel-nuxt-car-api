import type {Car, CarsResponse} from '~/types/car'
import {useApiClient} from '~/composables/useApiClient'

export const carApi = {

    async fetchCar(id: number): Promise<Car> {
        const api = useApiClient()
        return api(`/cars/${id}`)
    },

    async fetchCars(page = 1): Promise<CarsResponse> {
        const api = useApiClient()

        return api('/cars', {
            query: { page }
        })
    },

    async fetchLatest(): Promise<Car[]> {
        const api = useApiClient()

        const res: any = await api('/cars/latest')

        return Array.isArray(res)
            ? res
            : res?.data ?? []
    }

}

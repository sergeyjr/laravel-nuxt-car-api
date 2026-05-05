import type {Car, CarsResponse} from '~/types/car'
import {useApi} from '~/composables/useApi'

export const useCarApi = () => {

    const {api} = useApi()

    return {

        fetchCar(id: number): Promise<Car> {
            return api(`/cars/${id}`)
        },

        fetchCars(page = 1): Promise<CarsResponse> {
            return api('/cars', {
                query: {page}
            })
        },

        fetchLatest(): Promise<CarsResponse> {
            return api('/cars/latest')
        }

    }

}

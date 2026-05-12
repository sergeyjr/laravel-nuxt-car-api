import type {Car, CarsResponse} from '~/types/car'

export const useCarApi = () => {

    const api = useApi()

    return {

        fetchCar(id: number) {
            console.log('[CarAPI] fetchCar → request')
            return api.get<Car>(`/api/cars/${id}`)
        },

        fetchCars(page = 1) {
            console.log('[CarAPI] fetchCars → request')
            return api.get<CarsResponse>('/api/cars', {
                query: {page}
            })
        },

        fetchLatest() {
            console.log('[CarAPI] fetchLatest → request')
            return api.get<CarsResponse>('/api/cars/latest')
        }

    }

}

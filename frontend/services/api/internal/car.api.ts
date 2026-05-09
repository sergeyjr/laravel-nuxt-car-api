import type {Car, CarsResponse} from '~/types/car'

export const useCarApi = () => {

    const api = useApi()

    return {

        fetchCar(id: number): Promise<Car> {
            return api.get(`/api/cars/${id}`)
        },

        fetchCars(page = 1): Promise<CarsResponse> {
            return api.get('/api/cars', {
                query: {page}
            })
        },

        fetchLatest(): Promise<CarsResponse> {
            return api.get('/api/cars/latest')
        }

    }

}

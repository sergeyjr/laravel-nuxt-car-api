import type {Car, CarsResponse} from '~/types/car'

export const useCarApi = () => {

    const api = useApi()

    return {

        fetchCar(id: number): Promise<Car> {
            return api.get(`/cars/${id}`)
        },

        fetchCars(page = 1): Promise<CarsResponse> {
            return api.get('/cars', {
                query: {page}
            })
        },

        fetchLatest(): Promise<CarsResponse> {
            return api.get('/cars/latest')
        }

    }

}

import type {Car, CarsResponse} from '~/types/car'

export const useCarApi = () => {

    const api = useApi()

    return {

        fetchCar(id: number) {
            return api.get<Car>(`/api/cars/${id}`)
        },

        fetchCars(page = 1) {
            return api.get<CarsResponse>('/api/cars', {
                query: {
                    page
                }
            })
        },

        fetchLatest() {
            return api.get<CarsResponse>('/api/cars/latest')
        }

    }

}

import type {Car, CarsResponse} from '~/types/car'

export const useCarApi = () => {
    const api = useApi()

    return {

        fetchCar(id: number) {
            debugLog('[CarAPI] fetchCar → request')
            return api.get<Car>(`/api/cars/${id}`)
        },

        fetchCars(page = 1, sort = '-id') {
            debugLog('[CarAPI] fetchCars → request')
            return api.get<CarsResponse>('/api/cars', {
                query: {page, sort}
            })
        },

        fetchLatest() {
            debugLog('[CarAPI] fetchLatest → request')
            return api.get<CarsResponse>('/api/cars/latest')
        },

        createCar(payload: any) {
            debugLog('[CarAPI] create → request')
            return api.post('/api/car/create', payload)
        },

        generateCar() {
            debugLog('[CarAPI] generateMock → request')
            return api.get('/api/car/generate')
        }

    }

}

import type {Car, CarsResponse} from '~/types/car'

export const useCarApi = () => {

    const api = useApi()

    return {

        async fetchCar(id: number) {
            console.log('[CarAPI] fetchCar → request', id)
            const res = await api.get<Car>(`/api/cars/${id}`)
            console.log('[CarAPI] fetchCar → response', res)
            return res
        },

        async fetchCars(page = 1) {
            console.log('[CarAPI] fetchCars → request', page)
            const res = await api.get<CarsResponse>('/api/cars', {
                query: {page}
            })
            console.log('[CarAPI] fetchCars → response', res)
            return res
        },

        async fetchLatest() {
            console.log('[CarAPI] fetchLatest → request')
            const res = await api.get<CarsResponse>('/api/cars/latest')
            console.log('[CarAPI] fetchLatest → response', res)
            return res
        }

    }

}

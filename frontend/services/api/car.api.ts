import {useNuxtApp} from '#app'

function api() {
    return useNuxtApp().$api
}

export interface Car {
    id: number
    [key: string]: any
}

export interface CarsResponse {
    data: Car[]
    current_page: number
    last_page: number
    from: number | null
    to: number | null
    total: number
    per_page: number
}

export const carApi = {

    async fetchCar(id: number): Promise<Car> {
        return api()(`/api/cars/${id}`)
    },

    async fetchCars(page = 1): Promise<CarsResponse> {
        return api()('/api/cars', {
            query: {page}
        })
    },

    async fetchLatest(): Promise<Car[]> {
        const res = (await api()('http://laravel/api/cars/latest')) as Car[] | { data?: Car[] }

        return Array.isArray(res) ? res : res.data || []
    },

    // web_session_token

    async create(payload: any): Promise<{ data: Car; message?: string }> {
        return api()('/api/v1/car/create', {
            method: 'POST',
            body: payload
        })
    },

    async generateMock(): Promise<{ data: Car }> {
        return api()('/api/v1/car/generate-mock')
    }

}

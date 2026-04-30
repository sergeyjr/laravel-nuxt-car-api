import { useNuxtApp } from '#app'

export interface Car {
    id: number
    [key: string]: any
}

export interface CarsListResponse {
    data: Car[]
    meta?: any
}

export const carsApi = {
    list(page = 1): Promise<CarsListResponse> {
        const { $api } = useNuxtApp()
        return $api<CarsListResponse>('/cars', {
            query: { page }
        })
    },

    show(id: number): Promise<Car> {
        const { $api } = useNuxtApp()
        return $api<Car>(`/cars/${id}`)
    },

    latest(): Promise<Car[]> {
        const { $api } = useNuxtApp()
        return $api<Car[]>('/cars/latest')
    },

    create(payload: any): Promise<Car> {
        const { $api } = useNuxtApp()
        return $api<Car>('/v1/car/create', {
            method: 'POST',
            body: payload
        })
    },

    generateMock(): Promise<any> {
        const { $api } = useNuxtApp()
        return $api('/v1/car/generate-mock')
    }
}

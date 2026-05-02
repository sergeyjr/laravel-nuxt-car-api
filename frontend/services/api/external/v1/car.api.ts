import type {ApiResponse} from '~/types/api'
import type {Car} from '~/types/car'
import {useApiV1Client} from '~/composables/useApiV1Client'

export const carV1Api = {

    async create(payload: any): Promise<ApiResponse<Car>> {
        const api = useApiV1Client()

        return api('/car/create', {
            method: 'POST',
            body: payload
        })
    },

    async generateMock(): Promise<ApiResponse<Car>> {
        const api = useApiV1Client()

        return api('/car/generate-mock')
    }

}

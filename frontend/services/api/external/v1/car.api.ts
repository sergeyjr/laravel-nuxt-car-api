import type {ApiResponse} from '~/types/api'
import type {Car} from '~/types/car'
import {useNuxtApp} from '#app'

function apiV1() {
    return useNuxtApp().$apiV1
}

export const carV1Api = {

    async create(payload: any): Promise<ApiResponse<Car>> {
        return apiV1()('/car/create', {
            method: 'POST',
            body: payload
        })
    },

    async generateMock(): Promise<ApiResponse<Car>> {
        return apiV1()('/car/generate-mock')
    }

}

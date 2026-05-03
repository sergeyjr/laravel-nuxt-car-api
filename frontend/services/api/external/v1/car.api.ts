import {useApi} from '~/composables/useApi'

export const useCarV1Api = () => {

    const {apiV1} = useApi()

    return {

        create(payload: any) {
            return apiV1('/cars', {
                method: 'POST',
                body: payload
            })
        },

        generateMock() {
            return apiV1('/cars/generate', {
                method: 'POST'
            })
        }

    }
}

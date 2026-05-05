import {useApi} from '~/composables/useApi'

export const useCarV1Api = () => {

    const {apiV1} = useApi()

    return {

        create(payload: any) {
            return apiV1('/car/create', {
                method: 'POST',
                body: payload
            })
        },

        generateMock() {
            return apiV1('/car/generate-mock', {
                method: 'GET'
            })
        }

    }

}

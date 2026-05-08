export const useCarV1Api = () => {

    const api = useApi()

    return {

        create(payload: any) {
            return api.post('/car/create', {
                body: payload
            })
        },

        generateMock() {
            return api.get('/car/generate-mock')
        }

    }

}

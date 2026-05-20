export const useContactApi = () => {

    const api = useApi()

    return {

        submit(payload: any) {
            debugLog('[ContactAPI] submit → request')
            return api.post('/api/contact', payload)
        }

    }

}

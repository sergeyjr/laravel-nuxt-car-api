export const useContactApi = () => {

    const api = useApi()

    return {

        submit(payload: any) {
            return api.post('/api/contact', payload)
        }

    }

}

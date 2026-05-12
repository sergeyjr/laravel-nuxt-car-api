export const useContactApi = () => {

    const api = useApi()

    return {

        submit(payload: any) {
            console.log('[ContactAPI] submit → request')
            return api.post('/api/contact', payload)
        }

    }

}

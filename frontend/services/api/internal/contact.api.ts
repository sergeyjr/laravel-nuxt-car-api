export const useContactApi = () => {

    const api = useApi()

    return {

        async submit(payload: any) {
            console.log('[ContactAPI] submit → request', payload)
            const res = await api.post('/api/contact', payload)
            console.log('[ContactAPI] submit → response', res)
            return res
        }

    }

}

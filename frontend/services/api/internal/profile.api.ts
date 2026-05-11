export const useProfileApi = () => {

    const api = useApi()

    return {

        update(fd: FormData) {
            console.log('[ProfileAPI] update → request', {fd})
            const res = api.post('/api/profile/update', {
                fd
            })
            console.log('[ProfileAPI] update → response', res)
            return res
        },

        changePassword(payload: any) {
            console.log('[ProfileAPI] changePassword → request', payload)
            const res = api.post('/api/profile/password', payload)
            console.log('[ProfileAPI] changePassword → response', res)
            return res
        },

        delete() {
            console.log('[ProfileAPI] delete → request')
            const res = api.delete('/api/profile')
            console.log('[ProfileAPI] delete → response', res)
            return res
        }

    }

}

export const useProfileApi = () => {

    const api = useApi()

    return {

        updateProfile(payload: any) {
            console.log('[ProfileAPI] update → request')
            return api.post('/api/profile/update', payload)
        },

        changePassword(payload: any) {
            console.log('[ProfileAPI] changePassword → request')
            return api.post('/api/profile/password', payload)
        },

        delete() {
            console.log('[ProfileAPI] delete → request')
            return api.delete('/api/profile')
        }

    }

}

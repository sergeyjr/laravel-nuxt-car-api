export const useProfileApi = () => {

    const api = useApi()

    return {

        updateProfile(payload: any) {
            debugLog('[ProfileAPI] update → request')
            return api.post('/api/profile/update', payload)
        },

        changePassword(payload: any) {
            debugLog('[ProfileAPI] changePassword → request')
            return api.post('/api/profile/password', payload)
        },

        delete() {
            debugLog('[ProfileAPI] delete → request')
            return api.delete('/api/profile')
        }

    }

}

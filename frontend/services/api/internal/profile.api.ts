export const useProfileApi = () => {

    const api = useApi()

    return {

        update(fd: FormData) {
            return api.post('/api/profile/update', {
                fd
            })
        },

        changePassword(payload: any) {
            return api.post('/api/profile/password', {
                payload
            })
        },

        delete() {
            return api.delete('/api/profile')
        }

    }

}

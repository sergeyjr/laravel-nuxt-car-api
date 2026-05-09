export const useProfileApi = () => {

    const api = useApi()

    return {

        update(fd: FormData) {
            return api.post('/api/profile/update', {
                body: fd
            })
        },

        changePassword(payload: any) {
            return api.post('/api/profile/password', {
                body: payload
            })
        },

        delete() {
            return api.delete('/api/profile')
        }

    }

}

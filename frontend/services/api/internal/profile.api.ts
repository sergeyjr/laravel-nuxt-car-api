import {useApi} from '~/composables/useApi'

export const useProfileApi = () => {

    const {api} = useApi()

    return {

        update(fd: FormData) {
            return api('/profile/update', {
                method: 'POST',
                body: fd
            })
        },

        changePassword(payload: any) {
            return api('/profile/password', {
                method: 'POST',
                body: payload
            })
        },

        delete() {
            return api('/profile', {
                method: 'DELETE'
            })
        }

    }

}

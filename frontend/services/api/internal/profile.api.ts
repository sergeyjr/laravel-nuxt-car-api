import {useApi} from '~/composables/useApi'

export const useProfileApi = () => {

    const {authApi} = useApi()

    return {

        update(fd: FormData) {
            return authApi('/profile/update', {
                method: 'POST',
                body: fd
            })
        },

        changePassword(payload: any) {
            return authApi('/profile/password', {
                method: 'POST',
                body: payload
            })
        },

        delete() {
            return authApi('/profile', {
                method: 'DELETE'
            })
        }

    }

}

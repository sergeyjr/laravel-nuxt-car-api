import {useNuxtApp} from '#app'

function authApiClient() {
    return useNuxtApp().$authApiClient
}

export const profileApi = {

    update(fd: FormData) {
        return authApiClient()('/profile/update', {
            method: 'POST',
            body: fd
        })
    },

    changePassword(payload: any) {
        return authApiClient()('/rofile/password', {
            method: 'POST',
            body: payload
        })
    },

    delete() {
        return authApiClient()('/api/profile', {
            method: 'DELETE'
        })
    }

}

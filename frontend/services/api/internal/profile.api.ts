import {useNuxtApp} from '#app'

function api() {
    return useNuxtApp().$api
}

export const profileApi = {

    update(fd: FormData) {
        return api()('/profile/update', {
            method: 'POST',
            body: fd
        })
    },

    changePassword(payload: any) {
        return api()('/rofile/password', {
            method: 'POST',
            body: payload
        })
    },

    delete() {
        return api()('/api/profile', {
            method: 'DELETE'
        })
    }

}

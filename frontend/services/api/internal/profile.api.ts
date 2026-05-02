import {useNuxtApp} from '#app'

function api() {
    return useNuxtApp().$api
}

export const profileApi = {

    update(fd: FormData) {
        return api()('/sanctum/csrf-cookie').then(() =>
            api()('/api/profile/update', {
                method: 'POST',
                body: fd
            })
        )
    },

    changePassword(payload: any) {
        return api()('/sanctum/csrf-cookie').then(() =>
            api()('/api/profile/password', {
                method: 'POST',
                body: payload
            })
        )
    },

    delete() {
        return api()('/sanctum/csrf-cookie').then(() =>
            api()('/api/profile', {
                method: 'DELETE'
            })
        )
    }

}

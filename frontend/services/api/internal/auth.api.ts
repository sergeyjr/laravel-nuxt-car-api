import type {ApiResponse} from '~/types/api'
import type {User, AuthResponse} from '~/types/auth'
import {useNuxtApp} from '#app'

function api() {
    return useNuxtApp().$api
}

function apiV1() {
    return useNuxtApp().$apiV1
}

export const authApi = {

    // SPA (Sanctum Cookie)

    async login(email: string, password: string): Promise<AuthResponse> {
        return api()('/auth/login', {
            method: 'POST',
            body: {email, password}
        })
    },

    async register(payload: any): Promise<AuthResponse> {
        return api()('/auth/register', {
            method: 'POST',
            body: payload
        })
    },

    logout(): Promise<ApiResponse<null>> {
        return api()('/auth/logout', {
            method: 'POST'
        })
    },

    me(): Promise<User> {
        return api()('/auth/me')
    },

    // EXTERNAL API (Bearer Token)

    async loginExternal(data: any) {
        return apiV1()('/auth/login', {
            method: 'POST',
            body: data
        })
    },

    async registerExternal(data: any) {
        return apiV1()('/auth/register', {
            method: 'POST',
            body: data
        })
    }

}

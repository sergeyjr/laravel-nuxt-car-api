import type { ApiResponse } from '~/types/api'
import type { User, AuthResponse } from '~/types/auth'
import { useNuxtApp } from '#app'

function api() {
    return useNuxtApp().$api
}

function apiV1() {
    return useNuxtApp().$apiV1
}

function authApiClient() {
    return useNuxtApp().$authApiClient
}

export const authApi = {

    // SPA (Sanctum Cookie)

    async login(email: string, password: string): Promise<AuthResponse> {
        return authApiClient()('/auth/login', {
            method: 'POST',
            body: { email, password }
        })
    },

    async register(payload: any): Promise<AuthResponse> {
        return authApiClient()('/auth/register', {
            method: 'POST',
            body: payload
        })
    },

    logout(): Promise<ApiResponse<null>> {
        return authApiClient()('/auth/logout', {
            method: 'POST'
        })
    },

    me(): Promise<User> {
        return authApiClient()('/auth/me')
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

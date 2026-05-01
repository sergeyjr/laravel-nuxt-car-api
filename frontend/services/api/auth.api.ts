import {useNuxtApp} from '#app'

export interface User {
    id: number
    name: string
    email: string
    role?: string
}

export interface AuthResponse {
    user: User
    token?: string
    message?: string
}

function api() {
    return useNuxtApp().$api
}

export const authApi = {
    me(): Promise<{ user: User }> {
        return api()('/me')
    },

    login(email: string, password: string): Promise<AuthResponse> {
        return api()('/login', {
            method: 'POST',
            body: {email, password}
        })
    },

    register(payload: any): Promise<AuthResponse> {
        return api()('/register', {
            method: 'POST',
            body: payload
        })
    },

    logout(): Promise<{ message: string }> {
        return api()('/logout', {
            method: 'POST'
        })
    }
}

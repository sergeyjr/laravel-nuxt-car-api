import { useNuxtApp } from '#app'

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

export const authApi = {
    async me(): Promise<{ user: User }> {
        const { $api } = useNuxtApp()
        return await $api<{ user: User }>('/me')
    },

    async login(email: string, password: string): Promise<AuthResponse> {
        const { $api } = useNuxtApp()
        return await $api<AuthResponse>('/login', {
            method: 'POST',
            body: { email, password }
        })
    },

    async register(payload: any): Promise<AuthResponse> {
        const { $api } = useNuxtApp()
        return await $api<AuthResponse>('/register', {
            method: 'POST',
            body: payload
        })
    },

    async logout(): Promise<{ message: string }> {
        const { $api } = useNuxtApp()
        return await $api<{ message: string }>('/logout', {
            method: 'POST'
        })
    }
}

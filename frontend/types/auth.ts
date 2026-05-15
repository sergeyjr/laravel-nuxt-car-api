export interface User {
    id: number
    name: string
    email: string
    created_at?: string
    updated_at?: string
    role?: string
}

export interface AuthResponse {
    user: User
    message?: string
}

export interface LoginPayload {
    email: string
    password: string
}

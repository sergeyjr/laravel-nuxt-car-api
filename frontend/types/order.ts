export interface OrderResponse {
    id: number
    created_at: string
    status: string
    total: number
    items?: any[]
}

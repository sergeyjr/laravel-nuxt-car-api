export interface DashboardResponse {
    orders: any[]
    ordersCount: number
    carsCount: number
    cart: Record<string, unknown>
    cartTotal: number
}

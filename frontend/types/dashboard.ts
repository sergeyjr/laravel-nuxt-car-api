export interface DashboardResponse {
    orders: any[]
    ordersCount: number
    carsCount: number
    myCarsCount: number
    cart: Record<string, unknown>
    cartTotal: number
}

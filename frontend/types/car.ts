export interface Car {
    id: number
    [key: string]: any
}

export interface CarsResponse {
    data: Car[]
    current_page: number
    last_page: number
    from: number | null
    to: number | null
    total: number
    per_page: number
}

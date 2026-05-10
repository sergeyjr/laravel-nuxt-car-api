export interface CarOption {
    id?: number
    car_id?: number
    brand?: string | null
    model?: string | null
    year?: number | null
    body?: string | null
    mileage?: number | null
}

export type CarOptionValue = CarOption | null | []

export interface Car {
    id: number
    title?: string | null
    description?: string | null
    price?: number | null
    photo_url?: string | null
    contacts?: string | null
    created_at?: string
    updated_at?: string
    user_id?: number | null
    options?: CarOptionValue
}

export interface CarsResponse {
    current_page: number
    data: Car[]
    first_page_url?: string | null
    from: number | null
    last_page: number
    last_page_url?: string | null
    links?: Array<{
        url: string | null
        label: string
        page: number | null
        active: boolean
    }>
    next_page_url?: string | null
    path?: string
    per_page: number
    prev_page_url?: string | null
    to: number | null
    total: number
}

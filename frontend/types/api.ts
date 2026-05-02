export interface ApiResponse<T> {
    data: T // любой тип, который можно подставить позже
    message?: string
}

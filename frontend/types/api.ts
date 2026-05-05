export interface ApiResponse<T> {
    data: T // любой тип, который можно подставить позже
    message?: string
}

export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
}

export interface ApiErrorResponse {
    success: false;
    message?: string;
    errors?: Record<string, string[]>;
}

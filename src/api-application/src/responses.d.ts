export interface SuccessResponse<T> {
    payload: {
        status: true;
        errors: {};
        body: T;
    };
    statusCode: number;
}

export interface ErrorResponse<T> {
    payload: {
        status: false;
        errors: T;
        body: null;
    };
    statusCode: number;
}

export function createResponseSuccess<T>(payload: T, statusCode: number = 200): SuccessResponse<T>;
export function createResponseError<T>(
    field: string,
    error: T,
    statusCode: number = 400
): ErrorResponse<{ [s: string]: T }>;
export function createResponseErrors<T>(errors: T, statusCode: number = 400): ErrorResponse<T>;

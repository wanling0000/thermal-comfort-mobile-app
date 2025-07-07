export type ApiResponse<T> = {
    code: string;
    info: string;
    data: T;
};

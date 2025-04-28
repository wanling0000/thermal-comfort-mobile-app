export class AppError extends Error {
    public code: string;
    public originalError?: unknown;

    constructor(message: string, code: string = 'UNKNOWN', originalError?: unknown) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.originalError = originalError;
    }
}

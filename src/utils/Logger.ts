export enum LogLevel {
    Info = 'INFO',
    Warn = 'WARN',
    Error = 'ERROR',
}

export function log(message: string, level: LogLevel = LogLevel.Info, tag?: string) {
    const output = `[${level}]${tag ? `[${tag}]` : ''} ${message}`;
    if (level === LogLevel.Error) {
        console.error(output);
    } else if (level === LogLevel.Warn) {
        console.warn(output);
    } else {
        console.log(output);
    }
}

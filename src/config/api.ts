const isDev = process.env.NODE_ENV === 'development';

export const apiHostUrl = isDev
    ? "https://m1.apifoxmock.com/m1/5232532-4899640-default" // Use Apifox Mock in development
    : "https://real-api.com"; // Use real server in production

// Manually control whether to use local mock data
export const enableMock = isDev;

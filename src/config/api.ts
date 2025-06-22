export const enableMock = false;

export const apiHostUrl = enableMock
    ? "https://m1.apifoxmock.com/m1/5232532-4899640-default"
    // command line：ipconfig getifaddr en0
    : "http://172.20.10.10:8091";

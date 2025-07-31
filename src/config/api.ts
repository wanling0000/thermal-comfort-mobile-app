export const enableMock = false;

export const apiHostUrl = enableMock
    ? "http://192.168.1.197:8091"
    // command line：ipconfig getifaddr en0
    : "http://thermal-comfort-app-production.up.railway.app";


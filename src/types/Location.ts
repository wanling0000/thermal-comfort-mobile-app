// Used for the Location table in the database
export type Location = {
    locationId: string;
    displayName: string;
    isCustom: boolean;
    latitude: number;
    longitude: number;
    description?: string;
    userId: string;
};

// 简化版用于临时 UI/缓存/未登录状态
export type LocationPreview = {
    displayName: string;
    isCustom: boolean;
    latitude: number;
    longitude: number;
};

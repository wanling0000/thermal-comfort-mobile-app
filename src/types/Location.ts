
// 简化版用于临时 ui/缓存/未登录状态
export type LocationPreview = {
    displayName: string;
    isCustom?: boolean;
    customTag?: string;
    latitude: number;
    longitude: number;
};

export type UserLocationTagInput = {
    name: string; // 用户自定义标签名
    location?: {
        displayName: string;
        latitude: number;
        longitude: number;
    };
};

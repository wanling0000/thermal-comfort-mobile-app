// Used for real-time location
export type GeoLocation = {
    latitude: number;
    longitude: number;
};

// Used for the Location table in the database
export type LocationTag = {
    locationId: string;
    name: string;
    description?: string;
    coordinates?: GeoLocation;
    userId: string;
};


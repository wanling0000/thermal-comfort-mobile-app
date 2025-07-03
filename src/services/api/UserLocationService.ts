import { request } from "../../utils/request.ts";
import {UserLocationTagInput} from "../../types/Location.ts";

export const UserLocationService = {
    createUserLocationTag: async (input: UserLocationTagInput) => {
        return request('/api/v1/user-location-tags/create', {
            method: 'POST',
            body: JSON.stringify(input),
        });
    },

    getUserLocationPreviews: async (userId: string) => {
        return request(`/api/v1/user-location-tags/preview?userId=${userId}`, {
            method: 'GET',
        });
    },
};

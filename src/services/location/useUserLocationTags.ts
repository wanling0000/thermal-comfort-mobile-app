import {useEffect, useState} from "react";
import {LocationPreview} from "../../types/Location.ts";
import {UserLocationService} from "../api/UserLocationService.ts";

export function useUserLocationTags(userId: string) {
    const [tags, setTags] = useState<LocationPreview[]>([]);

    useEffect(() => {
        if (!userId) return;

        UserLocationService.getUserLocationPreviews(userId)
            .then(setTags)
            .catch(console.error);
    }, [userId]);

    return tags;
}

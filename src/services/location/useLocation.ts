import {useState, useEffect, useRef, useCallback} from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {LocationPreview, mapServerTagToLocationPreview} from "../../types/Location.ts";
import {reverseGeocode} from "./reverseGeocode.ts";
import {UserLocationService} from "../api/UserLocationService.ts";

type UseLocationResult = {
    location: LocationPreview | null;
    setCustomTag: (tag: string | null) => void;
};

export function useLocation(): UseLocationResult {
    const [location, setLocation] = useState<LocationPreview | null>(null);
    const lastLocationRef = useRef<LocationPreview | null>(null);
    const customTagRef = useRef<string | undefined>(undefined);

    const setCustomTag = useCallback((tag: string | null) => {
        customTagRef.current = tag ?? undefined;

        // 更新已有 location（如果有）
        if (lastLocationRef.current) {
            const prev = lastLocationRef.current;
            const updated: LocationPreview = {
                ...prev,
                customTag: tag ?? undefined,
                isCustom: !!tag,
            };
            lastLocationRef.current = updated;
            setLocation(updated);
        }
    }, []);

    useEffect(() => {
        async function requestLocationPermission() {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'This app needs access to your location to tag sensor data.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.warn('[useLocation] Location permission denied');
                    return false;
                }
            }
            return true;
        }

        async function handlePosition(latitude: number, longitude: number) {
            const prev = lastLocationRef.current;
            if (
                prev &&
                Math.abs(prev.latitude - latitude) < 0.00001 &&
                Math.abs(prev.longitude - longitude) < 0.00003 // 0.00001 度 ≈ 1m
            ) {
                return;
            }


            // 获取所有自定义标签
            let matchedTag: LocationPreview | null = null;
            try {
                const rawTags = await UserLocationService.getUserLocationPreviews();

                const tags: LocationPreview[] = rawTags.map(mapServerTagToLocationPreview);
                // 优先使用手动设定的 customTag
                if (customTagRef.current) {
                    matchedTag = tags.find(tag => tag.customTag === customTagRef.current) ?? null;
                }

                // 如果没有手动设定，则自动匹配坐标
                if (!matchedTag) {
                    matchedTag = tags.find((tag) => {
                        const dLat = tag.latitude - latitude;
                        const dLon = tag.longitude - longitude;
                        const distance = Math.sqrt(dLat * dLat + dLon * dLon) * 111000;
                        return distance < 10;
                    }) ?? null;
                }
            } catch (e) {
                console.warn('[useLocation] Failed to fetch user tags', e);
            }

            // 反地理编码作为兜底
            const displayName = matchedTag?.displayName ?? await reverseGeocode(latitude, longitude);

            const newLoc: LocationPreview = {
                latitude,
                longitude,
                displayName,
                customTag: matchedTag?.customTag,
                isCustom: !!matchedTag,
            };

            if (matchedTag?.customTag) {
                customTagRef.current = matchedTag.customTag;
                console.log('[useLocation] ✅ Updated customTagRef to:', customTagRef.current);
            }

            lastLocationRef.current = newLoc; // 更新引用
            setLocation(newLoc);
            console.log('[useLocation] 📦 Final location object:', newLoc);
        }

        async function initLocation() {
            const hasPermission = await requestLocationPermission();
            if (!hasPermission) return;

            // Fetch current location
            Geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log('[useLocation] First location:', latitude, longitude);
                    handlePosition(latitude, longitude);
                },
                (error) => {
                    console.error('[useLocation] Error getting first position:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000, // Timeout after 15 seconds
                    maximumAge: 10000, // Accept cached location up to 10 seconds old
                    forceRequestLocation: true, // Force fetch a fresh location if possible
                }
            );

            // Start watching location changes
            const watchId = Geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    handlePosition(latitude, longitude);
                },
                (error) => {
                    console.error('[useLocation] Error watching position:', error);
                },
                {
                    enableHighAccuracy: true,
                    distanceFilter: 5,
                }
            );

            return watchId;
        }

        initLocation();

    }, []);

    return {
        location,
        setCustomTag,
    };
}

import {useState, useEffect, useRef, useCallback} from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {LocationPreview} from "../../types/Location.ts";
import {reverseGeocode} from "./reverseGeocode.ts";

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

            const displayName = await reverseGeocode(latitude, longitude);
            const newLoc: LocationPreview = {
                latitude,
                longitude,
                displayName,
                customTag: customTagRef.current,
                isCustom: !!customTagRef.current,
            };

            lastLocationRef.current = newLoc; // 更新引用
            setLocation(newLoc);
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

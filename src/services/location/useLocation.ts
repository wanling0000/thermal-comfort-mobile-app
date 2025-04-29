import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { GeoLocation } from "../../types/Location.ts";

export function useLocation() {
    const [location, setLocation] = useState<GeoLocation | null>(null);

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

        async function initLocation() {
            const hasPermission = await requestLocationPermission();
            if (!hasPermission) return;

            // Fetch current location
            Geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    console.log('[useLocation] First location:', position.coords);
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
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
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

    return location;
}

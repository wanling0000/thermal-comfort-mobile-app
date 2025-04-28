import { PermissionsAndroid, Platform } from 'react-native';
import type { GeolocationResponse, GeolocationError } from '@react-native-community/geolocation';


declare const navigator: any;

export async function getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location Permission',
                message: 'We need access to your location to tag sensor data.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            throw new Error('Location permission denied');
        }
    }

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position: GeolocationResponse) => {
                const { latitude, longitude } = position.coords;
                resolve({ latitude, longitude });
            },
            (error: GeolocationError) => {
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 1000,
            },
        );
    });
}

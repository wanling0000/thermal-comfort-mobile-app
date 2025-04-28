/**
 * navigator等环境级初始化，应该尽量放在文件最顶层，在 App 函数组件之外。
 */
import { Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

declare const navigator: any;

export function applyPolyfills() {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
        navigator.geolocation = Geolocation;
    }
}

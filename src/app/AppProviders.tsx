import { useUploadQueue } from '../services/environment/useUploadQueue';
import { useBLEBridge } from '../services/ble-service/native/useBLEBridge';
import { useLocation } from '../services/location/useLocation';

/**
 * Global side-effect hooks that need to run as soon as the app starts.
 */
export default function AppProviders() {
    // TODO: uid
    // const userId = currentUser?.uid ?? 'admin';
    const userId ='admin';
    useBLEBridge();     // 启动 BLE 监听
    useLocation(userId);      // 启动位置监听
    useUploadQueue(userId);   // 启动上传队列
    return null;
}

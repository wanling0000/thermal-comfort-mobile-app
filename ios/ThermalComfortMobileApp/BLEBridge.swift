import Foundation
import React
import BLEFramework

@objc(BLEBridge)
class BLEBridge: RCTEventEmitter {

    static let didFoundDeviceEvent = "didFoundDevice"
    private var isObserving = false
    private var bleManager: BLEManager?

    override init() {
        super.init()
        print("✅ BLEBridge initialized")
        bleManager = BLEManager.shared  // 确保 BLEFramework 的 BLEManager 有 shared 单例
        setupCallbacks()
    }

    private func setupCallbacks() {
        print("⚡ Setting up BLE callbacks...")
        bleManager?.onDeviceDiscovered = { [weak self] data in
            guard let self = self else {
                print("❌ BLEBridge deallocated before receiving device")
                return
            }
            guard self.isObserving else {
                print("⚡ Discovered device, but JS is not observing")
                return
            }
            print("""
            ✅ Native discovered device:
            Name: \(data.name)
            Temp: \(data.temperature ?? -1) °C
            Humidity: \(data.humidity ?? -1) %
            Battery: \(data.battery ?? -1) %
            """)
            self.sendEvent(withName: Self.didFoundDeviceEvent, body: [
                "name": data.name,
                "temperature": data.temperature ?? NSNull(),
                "humidity": data.humidity ?? NSNull(),
                "battery": data.battery ?? NSNull()
            ])
        }
    }

    @objc
    func startScan() {
        print("✅ Native startScan() called from JS")
        bleManager?.startScan()
    }

    @objc
    func stopScan() {
        print("✅ Native stopScan() called from JS")
        bleManager?.stopScan()
    }

    override func supportedEvents() -> [String]! {
        return [Self.didFoundDeviceEvent]
    }

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    override func startObserving() {
        print("✅ JS started observing BLE events")
        isObserving = true
    }

    override func stopObserving() {
        print("❌ JS stopped observing BLE events")
        isObserving = false
    }
}

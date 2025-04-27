import Foundation
import React
import BLEFramework

@objc(BLEBridge)
class BLEBridge: RCTEventEmitter {

    static let didFoundDeviceEvent = "didFoundDevice"
    static let bleErrorEvent = "bleError"
    private var isObserving = false
    private var bleManager: BLEManager?

    override init() {
        super.init()
        Log.message("BLEBridge initialized", level: .info, category: "BLEBridge")
        bleManager = BLEManager.shared
        setupCallbacks()
    }

    private func setupCallbacks() {
        bleManager?.onDeviceDiscovered = { [weak self] data in
            guard let self = self, self.isObserving else { return }
            
            let formattedTemperature = data.temperature.map { Float(round(10 * $0) / 10) }
            let formattedHumidity = data.humidity
            let formattedBattery = data.battery

            Log.message("""
                Discovered device:
                Name: \(data.name)
                Temp: \(formattedTemperature.map { String(format: "%.1f", $0) } ?? "N/A") °C
                Humidity: \(formattedHumidity.map { "\($0)" } ?? "N/A") %
                Battery: \(formattedBattery.map { "\($0)" } ?? "N/A") %
            """, level: .debug, category: "BLEBridge")
            
            self.sendEvent(withName: Self.didFoundDeviceEvent, body: [
                "name": data.name,
                "temperature": data.temperature ?? NSNull(),
                "humidity": data.humidity ?? NSNull(),
                "battery": data.battery ?? NSNull()
            ] as [String: Any])
        }
    }

    @objc
    func startScan() {
      Log.message("Native startScan called", level: .info, category: "BLEBridge")
        bleManager?.startScan()
    }

    @objc
    func stopScan() {
        Log.message("Native stopScan called", level: .info, category: "BLEBridge")
        bleManager?.stopScan()
    }

    override func supportedEvents() -> [String]! {
        return [Self.didFoundDeviceEvent, Self.bleErrorEvent]
    }

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    override func startObserving() {
        Log.message("JS started observing BLE events", level: .debug, category: "BLEBridge")
        isObserving = true
    }

    override func stopObserving() {
        Log.message("JS stopped observing BLE events", level: .debug, category: "BLEBridge")
        isObserving = false
    }
}

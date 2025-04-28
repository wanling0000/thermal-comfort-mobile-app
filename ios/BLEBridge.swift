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
        print("[BLEBridge] Initialized")
        bleManager = BLEManager.shared
        setupCallbacks()
    }

    private func setupCallbacks() {
        bleManager?.onDeviceDiscovered = { [weak self] data in
            guard let self = self, self.isObserving else { return }

            let temperature = data.temperature.map { $0.rounded(toPlaces: 1) }
            let humidity = data.humidity
            let battery = data.battery

            let deviceInfo: [String: Any] = [
                "name": data.name,
                "temperature": temperature.map { String(format: "%.1f", $0) } ?? NSNull(),
                "humidity": humidity ?? NSNull(),
                "battery": battery ?? NSNull()
            ]

            Log.message("""
                Discovered device:
                Name: \(data.name)
                Temp: \(temperature.map { String(format: "%.1f", $0) } ?? "N/A") °C
                Humidity: \(humidity.map { "\($0)" } ?? "N/A") %
                Battery: \(battery.map { "\($0)" } ?? "N/A") %
            """, level: .debug, category: "BLEBridge")
            print("""
                [BLEBridge] Discovered device:
                Name: \(data.name)
                Temp: \(temperature.map { String(format: "%.1f", $0) } ?? "N/A") °C
                Humidity: \(humidity.map { "\($0)" } ?? "N/A") %
                Battery: \(battery.map { "\($0)" } ?? "N/A") %
            """)

            self.sendEvent(withName: Self.didFoundDeviceEvent, body: deviceInfo)
        }
    }

    // MARK: - Public Methods (Called from JS)

    @objc
    func startScan() {
        Log.message("Native startScan called", level: .info, category: "BLEBridge")
        print("[BLEBridge] startScan called")
        bleManager?.startScan()
    }

    @objc
    func stopScan() {
        Log.message("Native stopScan called", level: .info, category: "BLEBridge")
        print("[BLEBridge] stopScan called")
        bleManager?.stopScan()
    }

    // MARK: - RCTEventEmitter Overrides

    override func supportedEvents() -> [String]! {
        [Self.didFoundDeviceEvent, Self.bleErrorEvent]
    }

    override static func requiresMainQueueSetup() -> Bool {
        true
    }

    override func startObserving() {
        Log.message("JS started observing BLE events", level: .debug, category: "BLEBridge")
        print("[BLEBridge] startObserving called")
        isObserving = true
    }

    override func stopObserving() {
        Log.message("JS stopped observing BLE events", level: .debug, category: "BLEBridge")
        print("[BLEBridge] stopObserving called")
        isObserving = false
    }
}

// MARK: - Float Extension (Helper)

private extension Float {
    func rounded(toPlaces places: Int) -> Float {
        let divisor = pow(10.0, Float(places))
        return (self * divisor).rounded() / divisor
    }
}

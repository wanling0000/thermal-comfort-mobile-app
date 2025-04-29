import Foundation
import CoreBluetooth
import os

public class BLEManager: NSObject, ObservableObject {
    public static let shared = BLEManager()
    
    private var centralManager: CBCentralManager!
    @Published public var parsedSensorData: [(name: String, temperature: Float?, humidity: Int?, battery: Int?)] = []
    
    public var onDeviceDiscovered: ((_ data: (name: String, temperature: Float?, humidity: Int?, battery: Int?)) -> Void)?
    
    // MARK: - Logger
    private let logger = Logger(subsystem: Bundle.main.bundleIdentifier ?? "com.wanling.thermalcomfortapp", category: "BLEManager")
    
    public override init() {
        super.init()
        centralManager = CBCentralManager(delegate: self, queue: nil)
        logger.info("BLEManager initialized")
        print("[BLEManager] Initialized")
    }
    
    public func startScan() {
        guard let manager = centralManager, manager.state == .poweredOn else {
            logger.warning("Cannot start scan: Bluetooth not powered on.")
            print("[BLEManager] Cannot start scan: Bluetooth not powered on.")
            return
        }
        manager.stopScan()
        manager.scanForPeripherals(withServices: nil, options: [
            CBCentralManagerScanOptionAllowDuplicatesKey: true
        ])
        logger.info("BLE scan started.")
        print("[BLEManager] BLE scan started")
    }
    
    public func stopScan() {
        guard let manager = centralManager else { return }
        manager.stopScan()
        logger.info("BLE scan stopped.")
        print("[BLEManager] BLE scan stopped")
    }
}

extension BLEManager: CBCentralManagerDelegate {
    public func centralManagerDidUpdateState(_ central: CBCentralManager) {
        if central.state == .poweredOn {
            logger.info("Bluetooth is ON. Starting scan...")
            print("[BLEManager] Bluetooth is ON. Starting scan...")
            centralManager.scanForPeripherals(withServices: nil, options: [
                CBCentralManagerScanOptionAllowDuplicatesKey: true
            ])
        } else {
            logger.warning("Bluetooth not ready. State: \(central.state.rawValue)")
            print("[BLEManager] Bluetooth not ready. State: \(central.state.rawValue)")
        }
    }
    
    public func centralManager(_ central: CBCentralManager,
                                didDiscover peripheral: CBPeripheral,
                                advertisementData: [String: Any],
                                rssi RSSI: NSNumber) {
        
        guard let mData = advertisementData[CBAdvertisementDataManufacturerDataKey] as? Data,
              mData.count >= 8 else {
            return
        }
        
        if mData.prefix(2) != Data([0x69, 0x09]) {
            return
        }
        
        let serviceDataDict = advertisementData[CBAdvertisementDataServiceDataKey] as? [CBUUID: Data]
        let parsed = Self.parseBroadcastData(manufacturerData: mData, serviceData: serviceDataDict)
        let deviceName = Self.generateDeviceName(from: mData, serviceData: serviceDataDict)
        
        let sensorData = (
            name: deviceName,
            temperature: parsed.temperature,
            humidity: parsed.humidity,
            battery: parsed.battery
        )
        
        DispatchQueue.main.async {
            self.parsedSensorData.append(sensorData)
            self.onDeviceDiscovered?(sensorData)
        }
        
        logger.debug("""
            Device discovered:
            Name: \(deviceName)
            Temperature: \(parsed.temperature.map { String(format: "%.1f", $0) } ?? "N/A") °C
            Humidity: \(parsed.humidity.map { "\($0)" } ?? "N/A") %
            Battery: \(parsed.battery.map { "\($0)" } ?? "N/A") %
        """)
        print("""
            [BLEManager] Device discovered:
            Name: \(deviceName)
            Temp: \(parsed.temperature.map { String(format: "%.1f", $0) } ?? "N/A") °C
            Humidity: \(parsed.humidity.map { "\($0)" } ?? "N/A") %
            Battery: \(parsed.battery.map { "\($0)" } ?? "N/A") %
        """)
    }
    
    // MARK: - Helper Methods
    
    static func parseBroadcastData(manufacturerData: Data?, serviceData: [CBUUID: Data]?) -> (temperature: Float?, humidity: Int?, battery: Int?) {
        guard let mData = manufacturerData, mData.count >= 13 else {
            return (nil, nil, nil)
        }
        
        let tempLow = Float(mData[10] & 0x0F) * 0.1
        let tempHigh = Float(mData[11] & 0x7F)
        let isPositive = (mData[11] & 0x80) != 0
        let temperature = (tempHigh + tempLow) * (isPositive ? 1.0 : -1.0)
        
        let humidity = Int(mData[12] & 0x7F)
        
        var battery: Int? = nil
        if let sData = serviceData?[CBUUID(string: "FD3D")], sData.count >= 3 {
            battery = Int(sData[2] & 0x7F)
        }
        
        return (temperature, humidity, battery)
    }
    
    static func generateDeviceName(from manufacturerData: Data, serviceData: [CBUUID: Data]?) -> String {
        let macAddress: String
        if manufacturerData.count >= 8 {
            let macBytes = manufacturerData[2...7].map { String(format: "%02X", $0) }
            macAddress = macBytes.reversed().joined(separator: ":")
        } else {
            macAddress = "Unknown-MAC"
        }
        
        var deviceType = "SwitchBot Meter"
        if let service = serviceData?[CBUUID(string: "FD3D")], service.count > 0 {
            let deviceTypeByte = service[0]
            switch deviceTypeByte {
            case 0x54: deviceType = "SwitchBot MeterTH (Normal)"
            case 0x74: deviceType = "SwitchBot MeterTH (Add Mode)"
            default: break
            }
        }
        
        return "\(deviceType)-\(macAddress)"
    }
}

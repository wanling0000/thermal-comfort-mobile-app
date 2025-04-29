import os

enum LogLevel {
    case debug
    case info
    case error
}

struct Log {
    static let isDebugMode: Bool = {
#if DEBUG
        return true
#else
        return false
#endif
    }()

    static func message(_ message: String, level: LogLevel = .debug, category: String = "General") {
        let logger = Logger(subsystem: Bundle.main.bundleIdentifier ?? "com.wanling.thermalcomfortapp", category: category)
        
        switch level {
        case .debug:
            if isDebugMode {
                logger.debug("\(message)")
            }
        case .info:
            logger.info("\(message)")
        case .error:
            logger.error("\(message)")
        }
    }
}


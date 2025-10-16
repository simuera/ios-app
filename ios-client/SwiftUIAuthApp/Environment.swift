import Foundation

enum AppEnvironment {
    static var baseURL: URL {
        // Use 127.0.0.1 for simulator-localhost mapping; change for device or production
        return URL(string: "http://127.0.0.1:4000")!
    }

    static var tokenKey = "auth_token_v1"

    static var isDebug: Bool {
#if DEBUG
        return true
#else
        return false
#endif
    }
}

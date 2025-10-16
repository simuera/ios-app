import Foundation

struct JWTDecoder {
    static func decode(jwtToken jwt: String) -> [String: Any]? {
        let segments = jwt.split(separator: ".")
        guard segments.count == 3 else { return nil }
        let payloadSegment = segments[1]
        var base64 = String(payloadSegment)
            .replacingOccurrences(of: "-", with: "+")
            .replacingOccurrences(of: "_", with: "/")
        let rem = base64.count % 4
        if rem > 0 { base64 += String(repeating: "=", count: 4 - rem) }
        guard let data = Data(base64Encoded: base64) else { return nil }
        let json = try? JSONSerialization.jsonObject(with: data, options: [])
        return json as? [String: Any]
    }

    static func expiryDate(from token: String) -> Date? {
        guard let payload = decode(jwtToken: token) else { return nil }
        if let exp = payload["exp"] as? TimeInterval { return Date(timeIntervalSince1970: exp) }
        if let expStr = payload["exp"] as? String, let exp = TimeInterval(expStr) { return Date(timeIntervalSince1970: exp) }
        return nil
    }

    static func isExpired(token: String) -> Bool {
        guard let exp = expiryDate(from: token) else { return false }
        return Date() >= exp
    }
}

extension Notification.Name {
    static let didReceiveUnauthorized = Notification.Name("didReceiveUnauthorized")
}

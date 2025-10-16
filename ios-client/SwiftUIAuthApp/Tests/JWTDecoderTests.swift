import XCTest
@testable import SwiftUIAuthApp

final class JWTDecoderTests: XCTestCase {
    func makeJWT(with payload: [String: Any]) -> String {
        func base64UrlEncode(_ data: Data) -> String {
            var s = data.base64EncodedString()
            s = s.replacingOccurrences(of: "+", with: "-")
            s = s.replacingOccurrences(of: "/", with: "_")
            s = s.replacingOccurrences(of: "=", with: "")
            return s
        }
        let header = ["alg": "HS256", "typ": "JWT"]
        let headerData = try! JSONSerialization.data(withJSONObject: header)
        let payloadData = try! JSONSerialization.data(withJSONObject: payload)
        return "\(base64UrlEncode(headerData)).\(base64UrlEncode(payloadData)).signature"
    }

    func testExpiryParsing() {
        let future = Date().addingTimeInterval(3600).timeIntervalSince1970
        let token = makeJWT(with: ["exp": Int(future)])
        let expDate = JWTDecoder.expiryDate(from: token)
        XCTAssertNotNil(expDate)
        XCTAssertTrue(expDate! > Date())
        XCTAssertFalse(JWTDecoder.isExpired(token: token))
    }
}

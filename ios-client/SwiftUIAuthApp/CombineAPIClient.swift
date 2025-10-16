import Foundation
import Combine

final class CombineAPIClient {
    static let shared = CombineAPIClient()
    private init() {}

    private var cancellables = Set<AnyCancellable>()

    func request<T: Decodable>(_ path: String, method: String = "GET", body: Data? = nil) -> AnyPublisher<T, NetworkError> {
    var req = URLRequest(url: AppEnvironment.baseURL.appendingPathComponent(path))
        req.httpMethod = method
        if let b = body {
            req.httpBody = b
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        }
        if let token = KeychainHelper.shared.read(AppEnvironment.tokenKey) {
            if JWTDecoder.isExpired(token: token) {
                KeychainHelper.shared.delete(AppEnvironment.tokenKey)
                NotificationCenter.default.post(name: .didReceiveUnauthorized, object: nil)
                return Fail(error: NetworkError.unauthorized).eraseToAnyPublisher()
            }
            req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        return URLSession.shared.dataTaskPublisher(for: req)
            .tryMap { output in
                guard let http = output.response as? HTTPURLResponse else { throw NetworkError.invalidResponse }
                if http.statusCode == 401 {
                    KeychainHelper.shared.delete(AppEnvironment.tokenKey)
                    NotificationCenter.default.post(name: .didReceiveUnauthorized, object: nil)
                    throw NetworkError.unauthorized
                }
                return output.data
            }
            .mapError { err -> NetworkError in
                if let ne = err as? NetworkError { return ne }
                return NetworkError.other(err)
            }
            .flatMap { data -> AnyPublisher<T, NetworkError> in
                Just(data)
                    .decode(type: T.self, decoder: JSONDecoder())
                    .mapError { NetworkError.decoding($0) }
                    .eraseToAnyPublisher()
            }
            .eraseToAnyPublisher()
    }
}

import Foundation

final class APIClient {
    static let shared = APIClient()
    private init() {}

    private let baseURL = AppEnvironment.baseURL
    private let tokenKey = AppEnvironment.tokenKey

    private var token: String? {
        KeychainHelper.shared.read(tokenKey)
    }

    func request<T: Decodable>(_ path: String,
                               method: String = "GET",
                               body: Data? = nil,
                               completion: @escaping (Result<T, Error>) -> Void) {
        var req = URLRequest(url: baseURL.appendingPathComponent(path))
        req.httpMethod = method
        if let b = body {
            req.httpBody = b
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        }
        if let token = token {
            req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
            // if token expired, proactively clear and notify
            if JWTDecoder.isExpired(token: token) {
                KeychainHelper.shared.delete(tokenKey)
                NotificationCenter.default.post(name: .didReceiveUnauthorized, object: nil)
                completion(.failure(NSError(domain: "token.expired", code: 401)))
                return
            }
        }

        URLSession.shared.dataTask(with: req) { [weak self] data, resp, err in
            if let err = err { return completion(.failure(err)) }
            guard let http = resp as? HTTPURLResponse else { return completion(.failure(NSError(domain: "no-response", code: 0))) }
            if http.statusCode == 401 {
                if let key = self?.tokenKey { KeychainHelper.shared.delete(key) }
                NotificationCenter.default.post(name: .didReceiveUnauthorized, object: nil)
                return completion(.failure(NSError(domain: "unauthorized", code: 401)))
            }
            guard let data = data else { return completion(.failure(NSError(domain: "no-data", code: 0))) }
            do {
                let out = try JSONDecoder().decode(T.self, from: data)
                completion(.success(out))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }

    // For requests without a typed response
    func requestRaw(_ path: String, method: String = "POST", body: Data?, completion: @escaping (Result<Data, Error>) -> Void) {
        var req = URLRequest(url: baseURL.appendingPathComponent(path))
        req.httpMethod = method
        if let b = body { req.httpBody = b; req.setValue("application/json", forHTTPHeaderField: "Content-Type") }
        if let token = token { req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization") }

        URLSession.shared.dataTask(with: req) { [weak self] data, resp, err in
            if let err = err { return completion(.failure(err)) }
            guard let http = resp as? HTTPURLResponse else { return completion(.failure(NSError(domain: "no-response", code: 0))) }
            if http.statusCode == 401 {
                if let key = self?.tokenKey { KeychainHelper.shared.delete(key) }
                NotificationCenter.default.post(name: .didReceiveUnauthorized, object: nil)
                return completion(.failure(NSError(domain: "unauthorized", code: 401)))
            }
            guard let data = data else { return completion(.failure(NSError(domain: "no-data", code: 0))) }
            completion(.success(data))
        }.resume()
    }
}

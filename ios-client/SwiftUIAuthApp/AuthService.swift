import Foundation

final class AuthService {
    static let shared = AuthService()
    private init() {}

    private let baseURL = AppEnvironment.baseURL // change to your backend URL
    private let tokenKey = AppEnvironment.tokenKey

    var token: String? {
        get { KeychainHelper.shared.read(tokenKey) }
        set {
            if let t = newValue { KeychainHelper.shared.save(t, forKey: tokenKey) }
            else { KeychainHelper.shared.delete(tokenKey) }
        }
    }

    func register(email: String, password: String, name: String?, completion: @escaping (Result<User, Error>) -> Void) {
        let reqModel = RegisterRequest(email: email, password: password, name: name)
        let url = baseURL.appendingPathComponent("/api/auth/register")
        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = try? JSONEncoder().encode(reqModel)

        URLSession.shared.dataTask(with: req) { data, resp, err in
            if let err = err { return completion(.failure(err)) }
            guard let data = data else { return completion(.failure(NSError(domain: "no-data", code: 0))) }
            do {
                let user = try JSONDecoder().decode(User.self, from: data)
                completion(.success(user))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }

    func login(email: String, password: String, completion: @escaping (Result<User, Error>) -> Void) {
        let reqModel = LoginRequest(email: email, password: password)
        let url = baseURL.appendingPathComponent("/api/auth/login")
        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = try? JSONEncoder().encode(reqModel)

        URLSession.shared.dataTask(with: req) { [weak self] data, resp, err in
            if let err = err { return completion(.failure(err)) }
            guard let data = data else { return completion(.failure(NSError(domain: "no-data", code: 0))) }
            do {
                let out = try JSONDecoder().decode(LoginResponse.self, from: data)
                self?.token = out.token
                completion(.success(out.user))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }

    func authRequest(path: String, method: String = "GET", body: Data? = nil) -> URLRequest {
        let url = baseURL.appendingPathComponent(path)
        var req = URLRequest(url: url)
        req.httpMethod = method
        if let b = body {
            req.httpBody = b
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        }
        if let token = token {
            req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        return req
    }

    func fetchMe(completion: @escaping (Result<User, Error>) -> Void) {
        let req = authRequest(path: "/api/users/me")
        URLSession.shared.dataTask(with: req) { data, resp, err in
            if let err = err { return completion(.failure(err)) }
            guard let http = resp as? HTTPURLResponse else { return completion(.failure(NSError())) }
            if http.statusCode == 401 {
                self.token = nil
                return completion(.failure(NSError(domain: "unauthorized", code: 401)))
            }
            guard let data = data else { return completion(.failure(NSError(domain: "no-data", code: 0))) }
            do {
                let user = try JSONDecoder().decode(User.self, from: data)
                completion(.success(user))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
}

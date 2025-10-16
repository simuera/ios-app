import Foundation

struct User: Codable, Identifiable {
    let id: String
    let email: String
    let name: String?
}

struct LoginRequest: Codable {
    let email: String
    let password: String
}

struct LoginResponse: Codable {
    let token: String
    let user: User
}

struct RegisterRequest: Codable {
    let email: String
    let password: String
    let name: String?
}

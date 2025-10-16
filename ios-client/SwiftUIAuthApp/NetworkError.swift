import Foundation

enum NetworkError: LocalizedError {
    case noData
    case invalidResponse
    case unauthorized
    case decoding(Error)
    case other(Error)

    var errorDescription: String? {
        switch self {
        case .noData: return "No data returned from server"
        case .invalidResponse: return "Invalid response from server"
        case .unauthorized: return "Unauthorized - please login again"
        case .decoding(let e): return "Decoding error: \(e.localizedDescription)"
        case .other(let e): return e.localizedDescription
        }
    }
}

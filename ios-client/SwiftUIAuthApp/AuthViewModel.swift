import Foundation
import Combine

final class AuthViewModel: ObservableObject {
    @Published var user: User?
    @Published var isAuthenticated: Bool = false
    @Published var isLoading: Bool = false
    @Published var errorMessage: String?

    private var cancellables = Set<AnyCancellable>()

    init() {
        self.isAuthenticated = AuthService.shared.token != nil
        if isAuthenticated { loadMe() }
    }

    func register(email: String, password: String, name: String?) {
        isLoading = true
        AuthService.shared.register(email: email, password: password, name: name) { [weak self] res in
            DispatchQueue.main.async {
                self?.isLoading = false
                switch res {
                case .success(let u):
                    self?.user = u
                    self?.errorMessage = nil
                case .failure(let e):
                    self?.errorMessage = e.localizedDescription
                }
            }
        }
    }

    func login(email: String, password: String) {
        isLoading = true
        AuthService.shared.login(email: email, password: password) { [weak self] res in
            DispatchQueue.main.async {
                self?.isLoading = false
                switch res {
                case .success(let u):
                    self?.user = u
                    self?.isAuthenticated = true
                    self?.errorMessage = nil
                case .failure(let e):
                    self?.errorMessage = e.localizedDescription
                }
            }
        }
    }

    func logout() {
        AuthService.shared.token = nil
        user = nil
        isAuthenticated = false
    }

    func loadMe() {
        isLoading = true
        AuthService.shared.fetchMe { [weak self] res in
            DispatchQueue.main.async {
                self?.isLoading = false
                switch res {
                case .success(let u):
                    self?.user = u
                case .failure:
                    self?.logout()
                }
            }
        }
    }
}

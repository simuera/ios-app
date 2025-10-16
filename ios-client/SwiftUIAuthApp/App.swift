import SwiftUI

@main
struct SwiftUIAuthApp: App {
    @StateObject private var vm = AuthViewModel()

    var body: some Scene {
        WindowGroup {
            if vm.isAuthenticated {
                ContentView()
                    .environmentObject(vm)
            } else {
                NavigationStack {
                    LoginView()
                        .environmentObject(vm)
                }
            }
        }
    }
}

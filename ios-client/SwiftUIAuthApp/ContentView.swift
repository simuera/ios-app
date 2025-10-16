import SwiftUI

struct ContentView: View {
    @EnvironmentObject var vm: AuthViewModel

    var body: some View {
        NavigationStack {
            VStack(spacing: 16) {
                if let u = vm.user {
                    Text("Hello, \(u.name ?? u.email)")
                        .font(.title)
                } else {
                    Text("Loading...")
                }
                Button("Reload") { vm.loadMe() }
                Button("Logout", role: .destructive) { vm.logout() }
            }
            .padding()
            .navigationTitle("Home")
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView().environmentObject(AuthViewModel())
    }
}

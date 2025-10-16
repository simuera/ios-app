import SwiftUI

struct LoginView: View {
    @EnvironmentObject var vm: AuthViewModel
    @State private var email = ""
    @State private var password = ""
    @State private var showRegister = false

    var body: some View {
        VStack(spacing: 16) {
            Text("Welcome back")
                .font(.largeTitle).bold()
            TextField("Email", text: $email)
                .keyboardType(.emailAddress)
                .autocapitalization(.none)
                .textFieldStyle(.roundedBorder)
            SecureField("Password", text: $password)
                .textFieldStyle(.roundedBorder)
            if vm.isLoading { ProgressView() }
            if let err = vm.errorMessage { Text(err).foregroundColor(.red) }
            Button("Login") {
                vm.login(email: email, password: password)
            }
            .buttonStyle(.borderedProminent)

            Button("Register") { showRegister = true }
                .sheet(isPresented: $showRegister) {
                    NavigationStack { RegisterView().environmentObject(vm) }
                }
        }
        .padding()
        .navigationTitle("Sign In")
    }
}

struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        LoginView().environmentObject(AuthViewModel())
    }
}

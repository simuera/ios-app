import SwiftUI

struct RegisterView: View {
    @EnvironmentObject var vm: AuthViewModel
    @State private var email = ""
    @State private var password = ""
    @State private var name = ""
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        Form {
            Section { TextField("Name", text: $name) }
            Section { TextField("Email", text: $email).keyboardType(.emailAddress).autocapitalization(.none) }
            Section { SecureField("Password", text: $password) }

            if vm.isLoading { ProgressView() }
            if let err = vm.errorMessage { Text(err).foregroundColor(.red) }

            Button("Create account") {
                vm.register(email: email, password: password, name: name)
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    dismiss()
                }
            }
        }
        .navigationTitle("Register")
    }
}

struct RegisterView_Previews: PreviewProvider {
    static var previews: some View {
        RegisterView().environmentObject(AuthViewModel())
    }
}

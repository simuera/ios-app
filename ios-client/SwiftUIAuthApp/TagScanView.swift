import SwiftUI

struct TagScanView: View {
    @EnvironmentObject var vm: AuthViewModel
    @State private var code = ""
    @State private var payload = ""
    @State private var isLoading = false
    @State private var message: String?

    var body: some View {
        Form {
            Section(header: Text("Tag")) {
                TextField("Code", text: $code).autocapitalization(.none)
                TextField("JSON payload (optional)", text: $payload)
                    .autocapitalization(.none)
                    .disableAutocorrection(true)
            }
            if isLoading { ProgressView() }
            if let msg = message { Text(msg).foregroundColor(.secondary) }
            Button("Submit") {
                submit()
            }
            .disabled(code.isEmpty)
        }
        .navigationTitle("Scan Tag")
        .padding()
        .onReceive(NotificationCenter.default.publisher(for: .didReceiveUnauthorized)) { _ in
            vm.logout()
        }
    }

    func submit() {
        isLoading = true
        message = nil
        var bodyObj: [String: Any] = ["code": code]
        if let data = payload.data(using: .utf8),
           let json = try? JSONSerialization.jsonObject(with: data, options: []) {
            bodyObj["payload"] = json
        }
        let bodyData = try? JSONSerialization.data(withJSONObject: bodyObj, options: [])
        APIClient.shared.requestRaw("/api/tag-scans", method: "POST", body: bodyData) { res in
            DispatchQueue.main.async {
                isLoading = false
                switch res {
                case .success:
                    message = "Submitted"
                case .failure(let e):
                    message = "Error: \(e.localizedDescription)"
                }
            }
        }
    }
}

struct TagScanView_Previews: PreviewProvider {
    static var previews: some View {
        TagScanView().environmentObject(AuthViewModel())
    }
}

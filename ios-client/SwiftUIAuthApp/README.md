SwiftUIAuthApp

Minimal SwiftUI app scaffold (non-Xcode project) with files you can add to an Xcode project.

How to use
1. Open Xcode and create a new SwiftUI App project (iOS) named SwiftUIAuthApp.
2. Replace or add the files from this folder into the new project.
3. Edit `AuthService.swift` baseURL to point to your backend (e.g., http://localhost:3000).
4. Run on a simulator or device. For localhost on simulator, use http://127.0.0.1:3000 or set up port forwarding.

Files included:
- App.swift - app entry
- Models.swift - Codable models
- KeychainHelper.swift - Keychain wrapper
- AuthService.swift - networking and token storage
- AuthViewModel.swift - view model for auth flows
- LoginView.swift - SwiftUI login UI
- RegisterView.swift - SwiftUI register UI
- ContentView.swift - main app content after login

Notes:
- This scaffold uses URLSession and Keychain directly (no external dependencies).
- In production, switch to HTTPS and tighten Keychain access groups.
- Token expiry is detected via backend 401 responses; no refresh tokens implemented.

# LiteGPT Web

A modern, secure, and feature-rich AI chat interface designed to provide a premium user experience with multi-modal capabilities.

## ✨ Key Features

- **Modern UI/UX**: Sleek, ChatGPT-style interface with a pill-shaped input, smooth transitions, and a responsive design.
- **Collapsible Sidebar**: Efficiently manage multiple chat sessions with a tidy, collapsible sidebar for both desktop and mobile.
- **Vision Support**: Integrated image upload functionality. Choose from your **Camera** or **Gallery** to provide visual context to the AI (powered by Puter.js).
- **Secure Authentication**: 
  - **Credential Hashing**: Uses Web Crypto API (SHA-256) with combined credential hashing.
  - **Code Obfuscation**: Security constants are obfuscated within the codebase for enhanced production security.
  - **Protected Routes**: Unauthorized users are automatically redirected from secure pages to the login screen.
- **Session Management**: Rename, delete, or clear chat sessions. 
- **Data Portability**: Export and import your chat history as Markdown files.
- **Dynamic Themes**: Beautiful Light and Dark modes with typography powered by **JetBrains Mono**.

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **Routing**: React Router Dom v6
- **AI Core**: Puter.js (for LLM and Vision support)
- **Security**: Web Crypto API
- **Styling**: Vanilla CSS with modern variables and glassmorphism.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd litegpt-web
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the development server:
```bash
npm run dev
```

### Build
Generate a production-ready build:
```bash
npm run build
```

## 🔒 Security Note

This application implements client-side credential verification. For production environments, it is recommended to pair this with a proper backend authentication service. Current features include:
- SHA-256 hashing of combined credentials.
- `AuthContext` for state management.
- `ProtectedRoute` higher-order components.

---

**Developed By Murali with AI.**

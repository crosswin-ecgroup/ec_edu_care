# ec-educare-rise-mobile

Cross-platform mobile application for EC EduCare using React Native (Expo).

## Features

- **Authentication**: OAuth2 Authorization Code flow with PKCE (IdentityServer) and optional Telegram OTP.
- **State Management**: Zustand for auth state, RTK Query for API caching and data fetching.
- **Styling**: NativeWind (Tailwind CSS).
- **Navigation**: Expo Router (File-based routing).
- **Security**: Secure storage for tokens, automatic token refresh.

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env` (or just use the defaults in code for dev).
   ```bash
   cp .env.example .env
   ```
   Note: For Android Emulator, use `10.0.2.2` instead of `localhost`.

3. **IdentityServer Configuration**:
   Ensure your IdentityServer client `ec-educare-mobile` is configured with:
   - Redirect URI: `com.eceducare.app://` (or `com.eceducare.app:/` depending on strictness)
   - Scopes: `openid profile email roles offline_access educare.api`
   - PKCE enabled.
   - For Password Login (ROPC), ensure the client allows `password` grant type.

5. **Environment Variables**:
   Add `EXPO_PUBLIC_CLIENT_SECRET` if your client is confidential (not recommended for mobile) or requires it for ROPC.

6. **Run the App**:
   ```bash
   npm start
   ```
   - Press `a` for Android.
   - Press `i` for iOS.

## Project Structure

- `/app`: Expo Router screens.
- `/components`: Reusable UI components.
- `/services`: RTK Query API definitions.
- `/store`: Zustand and Redux stores.
- `/utils`: Helper functions (OAuth, SecureStore).

## Authentication Flow

1. User clicks "Sign in".
2. App opens system browser to IdentityServer.
3. User logs in.
4. IdentityServer redirects back to `com.eceducare.app://`.
5. App exchanges authorization code for Access & Refresh tokens.
6. Tokens are stored in SecureStore.
7. User is redirected to Dashboard.

## API Integration

- `api.base.ts` handles `Authorization: Bearer <token>` injection.
- Automatic 401 handling attempts to refresh the token.
- If refresh fails, user is logged out.

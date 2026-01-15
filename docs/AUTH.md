# Auth notes

This repo uses Auth0 Universal Login (hosted by Auth0). Frontends never handle passwords.

## Required env vars
Each app has a `.env.example`:
- VITE_AUTH0_DOMAIN
- VITE_AUTH0_CLIENT_ID
- VITE_AUTH0_REDIRECT_URI
- VITE_AUTH0_LOGOUT_URI
- (optional) VITE_AUTH0_AUDIENCE

## Routes
Each app follows:
- /        -> Login/Sign up UI
- /callback -> Auth0 redirect target (calls handleRedirectCallback)
- /home    -> Protected-ish page (checks isAuthenticated)

## Adding an API later
1) Create Auth0 API (audience)
2) Set VITE_AUTH0_AUDIENCE
3) Request token via getAccessToken() and send as `Authorization: Bearer <token>`
4) Validate JWT server-side

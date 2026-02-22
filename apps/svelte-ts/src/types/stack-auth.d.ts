declare module '@stack-auth/auth-spa' {
  export type AuthConfig = {
    domain: string;
    clientId: string;
    redirectUri: string;
    audience?: string;
  };

  export type UserProfile = {
    name?: string;
    email?: string;
    picture?: string;
    [key: string]: unknown;
  };

  export class AuthService {
    constructor(config: AuthConfig);
    init(): Promise<void>;
    login(options?: object): Promise<void>;
    signup(options?: object): Promise<void>;
    handleRedirectCallback(): Promise<void>;
    logout(returnTo: string): void;
    isAuthenticated(): Promise<boolean>;
    getUser(): Promise<UserProfile | undefined>;
    getAccessToken(): Promise<string>;
  }
}
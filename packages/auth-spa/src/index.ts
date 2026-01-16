import {
  createAuth0Client,
  type Auth0Client,
  type Auth0ClientOptions,
  type RedirectLoginOptions
} from "@auth0/auth0-spa-js";

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
  private client: Auth0Client | null = null;
  private config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  async init(): Promise<void> {
    const opts: Auth0ClientOptions = {
      domain: this.config.domain,
      clientId: this.config.clientId,
      authorizationParams: {
        redirect_uri: this.config.redirectUri,
        ...(this.config.audience ? { audience: this.config.audience } : {})
      }
    };
    this.client = await createAuth0Client(opts);
  }

  private mustClient(): Auth0Client {
    if (!this.client) {
      throw new Error("AuthService not initialized. Call auth.init() first.");
    }
    return this.client;
  }

  login(options?: Omit<RedirectLoginOptions, "authorizationParams">): Promise<void> {
  const client = this.mustClient();
  return client.loginWithRedirect({
    ...options,
    authorizationParams: {
      ...(options as any)?.authorizationParams,
      redirect_uri: this.config.redirectUri,
      ...(this.config.audience ? { audience: this.config.audience } : {})
    }
  } as any);
}

  signup(options?: Omit<RedirectLoginOptions, "authorizationParams">): Promise<void> {
  const client = this.mustClient();
  return client.loginWithRedirect({
    ...options,
    authorizationParams: {
      ...(options as any)?.authorizationParams,
      redirect_uri: this.config.redirectUri,
      screen_hint: "signup",
      ...(this.config.audience ? { audience: this.config.audience } : {})
    }
  } as any);
}

  async handleRedirectCallback(): Promise<void> {
    const client = this.mustClient();
    await client.handleRedirectCallback();
  }

  logout(returnTo: string): void {
    const client = this.mustClient();
    client.logout({ logoutParams: { returnTo } });
  }

  isAuthenticated(): Promise<boolean> {
    return this.mustClient().isAuthenticated();
  }

  getUser(): Promise<UserProfile | undefined> {
    return this.mustClient().getUser() as Promise<UserProfile | undefined>;
  }

  getAccessToken(): Promise<string> {
    return this.mustClient().getTokenSilently();
  }
}

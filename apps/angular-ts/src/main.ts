import { bootstrapApplication } from "@angular/platform-browser";
import { mergeApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";

import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";
import { environment } from "./environments/environment";

import { provideAuth0 } from "@auth0/auth0-angular";

const appConfig = mergeApplicationConfig(
  {
    providers: [
      provideRouter(routes),
      provideHttpClient(),
      ...provideAuth0({
        domain: environment.auth0.domain,
        clientId: environment.auth0.clientId,
        authorizationParams: {
          redirect_uri: environment.auth0.redirectUri,
          audience: environment.auth0.audience || undefined
        }
      })
    ]
  }
);

bootstrapApplication(AppComponent, appConfig).catch(console.error);

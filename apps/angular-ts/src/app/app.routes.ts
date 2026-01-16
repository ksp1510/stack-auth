import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login.component";
import { CallbackComponent } from "./pages/callback.component";
import { HomeComponent } from "./pages/home.component";

export const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "callback", component: CallbackComponent },
  { path: "home", component: HomeComponent },
  { path: "**", redirectTo: "" }
];

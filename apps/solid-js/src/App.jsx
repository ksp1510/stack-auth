import { Switch, Match } from "solid-js";
import { currentPath } from "./router";
import Login from "./routes/Login";
import Callback from "./routes/Callback";
import Home from "./routes/Home";

export default function App() {
  return (
    <main class="app">
      <Switch>
        <Match when={currentPath() === "/home"}>
          <Home />
        </Match>
        <Match when={currentPath() === "/callback"}>
          <Callback />
        </Match>
        <Match when={true}>
          <Login />
        </Match>
      </Switch>
    </main>
  );
}

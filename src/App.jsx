import { Router, Route, A } from "@solidjs/router";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import { Show } from "solid-js";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import Apply from "./pages/Apply";

export default function App() {
  return (
    <AuthProvider>
      <Router root={Layout}>
        <Route path="/" component={Home} />
        <Route path="/Home" component={Home} />
        <Route path="/Register" component={Register} />
        <Route path="/Login" component={Login} />
        <Route path="/Logout" component={Logout} />
        <Route path="/CreateEvent" component={CreateEvent} />
        <Route path="/event/:id" component={EventDetails} />
        <Route path="/apply/:id" component={Apply} />
      </Router>
    </AuthProvider>
  );
}

function Layout(props) {
  const appName = import.meta.env.VITE_APP_NAME;
  const session = useAuth();
  console.log(session())
  return (
    <>
    <div class="navbar bg-base-100 shadow-md p-4">
      <div class="flex-1">
        <A href="/Home" class="text-xl font-bold">📅 Događaji</A>
      </div>
      <div class="flex-none">
        <Show when={session()}>
          <A href="/CreateEvent" class="btn btn-primary">+ Novi događaj</A>
          <A href="/Logout" class="btn btn-outline ml-2">Odjava</A>
        </Show>
        <Show when={!session()}>
          <A href="/Login" class="btn btn-secondary">Prijava</A>
          <A href="/Register" class="btn btn-outline ml-2">Registracija</A>
        </Show>
      </div>
    </div>
    <div class="container mx-auto p-6">
        {props.children}
    </div>
  </>
  );
}
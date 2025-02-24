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
  return (
    <>
      <div class="navbar bg-gradient-to-r from-blue-700 via-purple-500 to-purple-700 text-white shadow-md p-4 rounded-xl">
        <div class="flex-1">
          <A href="/Home" class="text-xl font-bold text-white hover:text-blue-300" style="margin-left: 15px">📅 Događaji</A>
        </div>
        <div class="flex-none">
          <Show when={session()}>
            <A href="/CreateEvent" class="btn bg-blue-600 hover:bg-blue-700 text-white border-0">+ Novi događaj</A>
            <A href="/Logout" class="btn bg-blue-600 hover:bg-blue-700 text-white border-0 ml-2" style="margin-right: 15px">Odjava</A>
          </Show>
          <Show when={!session()}>
            <A href="/Login" class="btn bg-blue-600 hover:bg-blue-800 text-white border-0">Prijava</A>
            <A href="/Register" class="btn bg-blue-600 hover:bg-blue-800 text-white border-0 ml-2" style="margin-right: 15px">Registracija</A>
          </Show>
        </div>
      </div>
      <div class="container mx-auto p-6">
        {props.children}
      </div>
    </>
  );
}
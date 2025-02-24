import { createEffect, createSignal, Show, For } from "solid-js";
import { supabase } from "../services/supabase";
import { useAuth } from "../components/AuthProvider.jsx";

export default function Apply(props) {
  const session = useAuth();
  const [registrations, setRegistrations] = createSignal([]);

  createEffect(async () => {
    await loadRegistrations();
  });

  async function loadRegistrations() {
    if (session()) {
      const { data, error } = await supabase
        .from("registrations")
        .select("*");
      if (!error) {
        setRegistrations(data);
      }
    }
  }

  async function formSubmit(event) {
    event.preventDefault();

    const user_id = session().user.id;
    const event_id = props.params.id;
    const email = session().user.email;

    const { error } = await supabase
      .from("registrations")
      .insert({
        user_id: user_id,
        event_id: event_id,
        email: email
      });

    if (error) {
      alert("Prijava nije uspjela.");
    } else {
      setRegistrations((prev) => [
        ...prev,
        {
          user_id: user_id,
          event_id: event_id,
          email: email
        }
      ]);
      event.target.reset();
    }
  }


  return (
    <>
      <form onSubmit={formSubmit}>
        <div className="p-4 bg-base-200 rounded-3xl bg-gray-800">
          <h2 className="text-2xl font-bold text-center mb-1 text-white-600">Moje prijave</h2>
          <p class="text-lg text-center mb-3 text-gray-500">Prethodne prijave</p>
          <Show when={session() && registrations()}>
            <For each={registrations()} fallback={<div class="bg-base-100 p-3 rounded-xl">Nema prethodnih prijava.</div>}>
              {(item) => <div class="bg-blue-100 p-4 rounded-xl shadow-md mb-4">
                <div class="text-blue-600">{item.email}</div>
                <div class="text-gray-500">{item.user_id}</div>
              </div>}
            </For>
          </Show>
          <div className="mb-4 mt-4">
            <input type="submit" value="Prijavi se" class="bg-blue-500 text-white p-2 rounded-lg cursor-pointer hover:bg-blue-600 transition" />
          </div>
        </div>
      </form >
    </>
  );
}
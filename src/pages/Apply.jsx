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

  async function deleteEvents(id) {
    const { error } = await supabase
      .from("event")
      .delete()
      .eq("id", id);
    if (error) {
      alert("Operacija nije uspjela.");
      console.log(error);
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
      event.target.reset();
    }
  }

  return (
    <>
      <form onSubmit={formSubmit}>
        <div className="p-4 bg-base-200 rounded-3xl">
          <h2 className="text-2xl font-bold mb-4 uppercase">Moje prijave</h2>
          <p class="text-lg mb-3">Prethodne prijave</p>
          <Show when={session() && registrations()}>
            <For each={registrations()} fallback={<div class="bg-base-100 p-3 rounded-xl">Nema prethodnih prijava.</div>}>
              {(item) => <div class="flex flex-col gap-2 items-end bg-base-100 text-white p-2 rounded mb-5">
                <div class="text-blue-500 place-self-start text-l uppercase">{item.email}</div>
                <div class="text-blue-500 place-self-start text-l uppercase">{item.user_id}</div>
              </div>}
            </For>
          </Show>
          <div className="mb-4 mt-4">
            <input type="submit" value="Prijavi se" class="bg-slate-600 text-white p-2 rounded" />
          </div>
        </div>
      </form >
    </>
  );
}
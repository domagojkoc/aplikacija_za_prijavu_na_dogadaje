import { createEffect, createSignal, Show, For } from "solid-js";
import { pb } from "../services/pocketbase";
import { useAuth } from "../components/AuthProvider.jsx";

export default function Apply(props) {
  const { user } = useAuth();
  const [registrations, setRegistrations] = createSignal([]);

  createEffect(async () => {
    await loadRegistrations();
  });

  async function loadRegistrations() {
    if (pb.authStore.isValid) {
      try {
        const records = await pb.collection("registrations").getFullList({
          filter: `user = "${pb.authStore.model.id}"`,
          expand: "event"
        });
        setRegistrations(records);
      } catch (err) {
        console.error("Greška pri dohvaćanju prijava:", err);
      }
    }
  }

  async function formSubmit(event) {
    event.preventDefault();

    if (!pb.authStore.isValid) {
      alert("Morate biti prijavljeni!");
      return;
    }

    try {
      await pb.collection("registrations").create({
        user: pb.authStore.model.id,
        event: props.params.id,
        email: pb.authStore.model.email
      });
      await loadRegistrations();
    } catch (err) {
      alert("Prijava nije uspjela: " + err.message);
    }
  }

  return (
    <>
      <form onSubmit={formSubmit}>
        <div class="p-4 bg-base-200 rounded-3xl bg-gray-800">
          <h2 class="text-2xl font-bold text-center mb-1 text-white">Moje prijave</h2>
          <p class="text-lg text-center mb-3 text-gray-400">Prethodne prijave</p>
          
          <Show when={pb.authStore.isValid && registrations().length > 0}>
            <For each={registrations()} fallback={<div class="bg-base-100 p-3 rounded-xl">Nema prethodnih prijava.</div>}>
              {(item) => (
                <div class="bg-blue-100 p-4 rounded-xl shadow-md mb-4">
                  <div class="text-blue-600">{item.email}</div>
                  <div class="text-gray-500">{item.expand?.event?.name || "Nepoznat događaj"}</div>
                </div>
              )}
            </For>
          </Show>

          <div class="mb-4 mt-4">
            <input 
              type="submit" 
              value="Prijavi se" 
              class="bg-blue-500 text-white p-2 rounded-lg cursor-pointer hover:bg-blue-600 transition w-full" 
            />
          </div>
        </div>
      </form>
    </>
  );
}

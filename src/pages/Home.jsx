import { createEffect, createSignal, Show, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../services/supabase";

export default function Home(props) {
  const navigate = useNavigate();
  const session = useAuth();

  const [events, setEvents] = createSignal(null);

  createEffect(async () => {
    await loadEvents();
  });

  async function loadEvents() {
    if (session()) {
      const { data, error } = await supabase
        .from("event")
        .select("*");
      if (!error) {
        setEvents(data);
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

  const handleClickDetails = (item) => {
    navigate(`/event/${item.id}`);
  }

  return (
    <>
      <Show when={!session()}>
        <div class="bg-red-400 text-white text-3xl p-10 rounded">Morate se prijaviti da biste vidjeli događaje!</div>
      </Show>
      <Show when={session() && events()}>
        <For each={events()} fallback={<div>Nema događaja.</div>}>
          {(item) => <div class="flex flex-col gap-2 items-end bg-base-200 text-white p-2 rounded mb-5">
            <div class="text-blue-600 place-self-start text-xl">{item.name}</div>
            <div class="place-self-start line-clamp-3">{item.description}</div>
            <div class="place-self-start line-clamp-3">{item.date}</div>
            <button class="bg-blue-500 text-white p-2 rounded text-sm" onClick={() => deleteEvents(item)}>Izbriši</button>
            <button class="bg-green-500 text-white p-2 rounded text-sm" onClick={() => handleClickDetails(item)}>Detalji</button>
          </div>}
        </For>
      </Show>
    </>
  );
}
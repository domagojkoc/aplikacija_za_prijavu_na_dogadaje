import { createEffect, createSignal, Show, For } from "solid-js";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../services/supabase";

export default function Home(props) {
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

  return (
    <>
      <Show when={!session()}>
        <div class="bg-red-400 text-white text-3xl p-10 rounded">Morate se prijaviti da biste vidjeli događaje!</div>
      </Show>
      <Show when={session() && events()}>
        <For each={events()} fallback={<div>Nema događaja.</div>}>
          {(item) => <div class="flex flex-col gap-2 items-end bg-blue-400 text-white p-2 rounded mb-5">
            <div class="place-self-start text-xl">{item.name}</div>
            <div class="place-self-start line-clamp-3">{item.description}</div>
            <div class="place-self-start line-clamp-3">{item.date}</div>
          </div>}
        </For>
      </Show>
    </>
  );
}
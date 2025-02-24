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

  const handleClickDetails = (item) => {
    navigate(`/event/${item.id}`);
  }

  return (
    <>
      <Show when={!session()}>
        <div class="bg-red-400 text-white text-3xl p-10 rounded-md mb-4 shadow-xl">Morate se prijaviti da biste vidjeli događaje!</div>
      </Show>
      <Show when={session() && events()}>
        <For each={events()} fallback={<div class=" flex justify-center items-center h-screen font-bold text-2xl text-center">Nema događaja.</div>}>
          {(item) => <div class="bg-gray-800 flex flex-col gap-2  blue shadow-lg rounded-lg p-8 mb-8 hover:shadow-2xl transition ease-in-out duration-300">
            <div class="text-blue-600 place-self-start text-xl">{item.name}</div>
            <div class="place-self-start line-clamp-3">{item.description}</div>
            <div class="place-self-start line-clamp-3">{item.date}</div>
            <button class="btn btn-outline border-blue-500 text-white w-full hover:bg-blue-500" onClick={() => handleClickDetails(item)}>Detalji</button>
          </div>}
        </For>
      </Show>
    </>
  );
}
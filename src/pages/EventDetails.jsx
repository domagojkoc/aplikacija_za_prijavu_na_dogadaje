import { supabase } from "../services/supabase";
import { createEffect, createSignal, Show, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../components/AuthProvider.jsx";

export default function EventDetails(props) {
  const navigate = useNavigate();
  const session = useAuth();

  const [event, setEvent] = createSignal([]);


  createEffect(async () => {
    await loadEvent();
  });

  async function loadEvent() {
    if (session()) {
      const { data, error } = await supabase
        .from("event")
        .select("*")
        .eq("id", props.params.id);
      if (!error) {
        setEvent(data);
      }
    }
  }
  
  const handleClick = (item) => {
    navigate(`/Apply/${item.id}`);
  }

  return (
    <>
      <Show when={session() && event()}>
        <For each={event()} fallback={<div>Nema događaja.</div>}>
          {(item) => <div class="flex flex-col gap-2 items-end bg-base-300 text-white p-2 rounded mb-5">
            <div class="text-blue-600 place-self-start text-2xl uppercase">{item.name}</div>
            <div class="place-self-start line-clamp-3">{item.description}</div>
            <div class="place-self-start line-clamp-3">{item.date}</div>
            <button class="bg-blue-500 text-white p-2 rounded text-sm" onClick={() => deleteEvents(item)}>Izbriši</button>
            <button class="bg-green-500 text-white p-2 rounded text-sm" onClick={() => handleClick(item)}>Prijava</button>
          </div>}
        </For>
      </Show>
    </>
  );
}
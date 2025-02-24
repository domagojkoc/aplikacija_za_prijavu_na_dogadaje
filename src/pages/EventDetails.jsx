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
  };

  const deleteEvents = async (item) => {
    if (session()) {
      const { error: deleteRegistrationsError } = await supabase
        .from("registrations")
        .delete()
        .eq("event_id", item.id);
      if (deleteRegistrationsError) {
        console.error("Došlo je do pogreške prilikom brisanja prijava:", deleteRegistrationsError.message);
        return;
      }
      const { error } = await supabase
        .from("event")
        .delete()
        .eq("id", item.id);
 
      if (error) {
        console.error("Došlo je do pogreške prilikom brisanja:", error.message);
      } else {
        await loadEvent();
        navigate("/");
      }
    }
  };

  return (
    <>
      <Show when={session() && event()}>
        <For each={event()} fallback={<div>Nema događaja.</div>}>
          {(item) => (
            <div class="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col gap-4 max-w-3xl mx-auto">
              <div class="text-3xl font-bold text-blue-600 uppercase">{item.name}</div>
              <div class="text-gray-400 text-lg line-clamp-4">{item.description}</div>
              <div class="text-sm text-gray-500">{item.date}</div>
              <div class="flex justify-between gap-4 mt-4"></div>
              <button class="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out" onClick={() => deleteEvents(item)}>Izbriši</button>
              <button class="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out" onClick={() => handleClick(item)}>Prijava</button>
            </div>
          )}
        </For>
      </Show>
    </>
  );
}
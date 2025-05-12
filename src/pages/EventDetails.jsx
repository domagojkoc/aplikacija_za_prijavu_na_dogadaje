import { createEffect, createSignal, Show, For } from "solid-js";
import { pb } from "../services/pocketbase";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../components/AuthProvider.jsx";

export default function EventDetails(props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = createSignal(null);

  createEffect(async () => {
    await loadEvent();
  });

  async function loadEvent() {
    try {
      const record = await pb.collection("events").getOne(props.params.id, {
        expand: "registrations"
      });
      setEvent(record);
    } catch (error) {
      console.error("Greška pri učitavanju događaja:", error);
    }
  }

  const handleApply = () => {
    navigate(`/apply/${props.params.id}`);
  };

  const deleteEvent = async () => {
    if (!pb.authStore.isValid || event().creator !== pb.authStore.model.id) return;

    try {
      await pb.collection("registrations").getFullList({
        filter: `event = "${event().id}"`
      }).then((records) => {
        records.forEach(async (record) => {
          await pb.collection("registrations").delete(record.id);
        });
      });
      
      await pb.collection("events").delete(event().id);
      navigate("/");
    } catch (error) {
      console.error("Greška pri brisanju:", error);
    }
  };

  return (
    <Show when={event()}>
      <div class="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col gap-4 max-w-3xl mx-auto">
        <div class="text-3xl font-bold text-blue-600 uppercase">{event().name}</div>
        <div class="text-gray-400 text-lg line-clamp-4">{event().description}</div>
        <div class="text-sm text-gray-500">
          {new Date(event().date).toLocaleDateString()}
        </div>
        
        <Show when={pb.authStore.model?.id === event().creator}>
          <button 
            class="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
            onClick={deleteEvent}
          >
            Izbriši
          </button>
        </Show>

        <button 
          class="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out"
          onClick={handleApply}
        >
          Prijava
        </button>
      </div>
    </Show>
  );
}

import { createSignal, Show } from "solid-js";
import { pb } from "../services/pocketbase";
import { useAuth } from "../components/AuthProvider";

export default function CreateEvent(props) {
  const { user } = useAuth();
  const [success, setSuccess] = createSignal(false);

  async function formSubmit(event) {
    setSuccess(false);
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      await pb.collection("events").create({
        name: formData.get("name"),
        description: formData.get("description"),
        date: formData.get("date"),
        creator: user.id
      });
      
      setSuccess(true);
      event.target.reset();
    } catch (error) {
      console.error("Greška pri kreiranju događaja:", error);
      alert("Kreiranje nije uspjelo: " + error.message);
    }
  }

  return (
    <>
      <Show when={success()}>
        <div class="bg-green-400 text-white p-3 rounded-lg mb-4 text-center">
          Događaj uspješno kreiran!
        </div>
      </Show>
      <form onSubmit={formSubmit}>
        <div class="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 class="text-2xl font-bold mb-4 text-center">Novi događaj</h2>
          <input 
            type="text" 
            name="name" 
            placeholder="Naziv" 
            class="border p-2 mb-2 w-full rounded-lg shadow-md" 
            required
          />
          <textarea 
            placeholder="Opis" 
            name="description" 
            class="border p-2 mb-2 w-full rounded-lg shadow-md" 
            required
          />
          <input 
            type="date" 
            name="date" 
            class="border p-2 mb-2 w-full rounded-lg shadow-md" 
            required
          />
          <div class="p-2 flex flex-col gap-1">
            <input 
              type="submit" 
              value="Kreiraj" 
              class="bg-blue-500 text-white p-2 rounded-lg cursor-pointer hover:bg-blue-600 transition" 
            />
          </div>
        </div>
      </form>
    </>
  );
}

import { createSignal, Show } from "solid-js";
import { supabase } from "../services/supabase";
import { useAuth } from "../components/AuthProvider";

export default function CreateEvent(props) {
  const session = useAuth();
  const [success, setSuccess] = createSignal(false);

  async function formSubmit(event) {
    setSuccess(false);
    event.preventDefault();
    const formData = new FormData(event.target);

    const name = formData.get("name");
    const description = formData.get("description");
    const date = formData.get("date")
    const user_id = session().user.id;

    const { error } = await supabase
      .from("event")
      .insert({
        name: name,
        description:description,
        date: date,
        user_id: user_id
      });

    if (error) {
      console.error("Error during insert:", error);
      alert("Spremanje nije uspjelo.");
    } else {
      setSuccess(true);
      event.target.reset();
    }
  }

  return (
    <>
      <Show when={success()}>
        <div class="bg-green-400 text-white p-2 rounded my-5">
          Događaj uspješno spremljen!
        </div>
      </Show>
      <form onSubmit={formSubmit}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Novi događaj</h2>
          <input type="text" name="name" placeholder="Naziv" className="border p-2 mb-2 w-full" />
          <textarea placeholder="Opis" name="description" className="border p-2 mb-2 w-full" />
          <input type="date" name="date" className="border p-2 mb-2 w-full" />
          <div class="p-2 flex flex-col gap-1">
            <input type="submit" value="Pošalji" class="bg-slate-600 text-white p-2 rounded" />
          </div>
        </div>
      </form >
    </>
  );
}
import { createSignal, createResource } from "solid-js";
import { useParams } from "solid-app-router";
import { supabase } from "../services/supabase";

export default function EventDetails(props) {
  const { id } = useParams(); 
  const [event, setEvent] = createSignal(null);
  const [registered, setRegistered] = createSignal(false);

  const fetchEvent = async () => {
    const { data, error } = await supabase.from("events").select("*").eq("id", id).single();
    if (error) console.error("Greška pri dohvaćanju događaja:", error);
    else setEvent(data);
  };

  const checkRegistration = async () => {
    const user = supabase.auth.user();
    if (!user) return;
    
    const { data } = await supabase.from("registrations").select("*").eq("user_id", user.id).eq("event_id", id);
    if (data.length > 0) setRegistered(true);
  };

  const handleRegister = async () => {
    const user = supabase.auth.user();
    if (!user) {
      alert("Morate biti prijavljeni da biste se registrirali.");
      return;
    }

    const { error } = await supabase.from("registrations").insert([{ user_id: user.id, event_id: id }]);
    if (error) alert("Greška pri prijavi.");
    else {
      alert("Uspješno ste prijavljeni!");
      setRegistered(true);
    }
  };

  createResource(fetchEvent);
  createResource(checkRegistration);

  return (
    <div className="p-6">
      {event() ? (
        <>
          <h2 className="text-2xl font-bold">{event().name}</h2>
          <p className="text-gray-700">{event().description}</p>
          <p className="text-sm text-gray-500">{event().date}</p>
          {!registered() ? (
            <button className="bg-green-500 text-white p-2 rounded-lg mt-4" onClick={handleRegister}>
              Prijavi se na događaj
            </button>
          ) : (
            <p className="text-green-600 mt-4">Već ste prijavljeni na ovaj događaj.</p>
          )}
        </>
      ) : (
        <p>Učitavanje...</p>
      )}
    </div>
  );
}
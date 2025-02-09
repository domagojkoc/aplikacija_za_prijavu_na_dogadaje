import { createSignal, createResource } from "solid-js";
import { supabase } from "../services/supabase";

export default function Apply(props) {
  const [registrations, setRegistrations] = createSignal([]);

  const fetchRegistrations = async () => {
    const user = supabase.auth.user();
    if (!user) return;

    const { data, error } = await supabase
      .from("registrations")
      .select("events(id, name, date)")
      .eq("user_id", user.id);

    if (error) console.error("Greška pri dohvaćanju prijava:", error);
    else setRegistrations(data);
  };

  createResource(fetchRegistrations);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Moje prijave</h2>
      {registrations().length > 0 ? (
        <ul>
          {registrations().map((r) => (
            <li key={r.events.id} className="border p-4 rounded-lg shadow-md my-2">
              <h3 className="text-xl font-semibold">{r.events.name}</h3>
              <p className="text-sm text-gray-500">{r.events.date}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nema prijavljenih događaja.</p>
      )}
    </div>
  );
}
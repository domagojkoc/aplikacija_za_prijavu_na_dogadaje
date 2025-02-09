import { createSignal } from "solid-js";
import { supabase } from "../services/supabase";

export default function Login(props) {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email(),
      password: password(),
    });
    if (error) setError("Neuspješna prijava. Provjerite podatke.");
    else window.location.href = "/Home";
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-4">Prijava</h2>
      <input
        type="email"
        placeholder="Email"
        className="border p-2 mb-2 w-64"
        onInput={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Lozinka"
        className="border p-2 mb-2 w-64"
        onInput={(e) => setPassword(e.target.value)}
      />
      <button className="bg-blue-500 text-white p-2 rounded-lg" onClick={handleLogin}>
        Prijavi se
      </button>
      <p class="text-sm font-light text-gray-400">
        Nemate račun? <a href="/Register" class="font-medium  hover:underline text-primary-500 text-white hover:text-info ">Registracija</a>
      </p>
      {error() && <p className="text-red-500 mt-2">{error()}</p>}
    </div>
  );
}
import { createSignal } from "solid-js";
import { pb } from "../services/pocketbase";

export default function Login(props) {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");

  const handleLogin = async () => {
    try {
      await pb.collection('users').authWithPassword(email(), password());
      window.location.href = "/";
    } catch (err) {
      setError("Neuspješna prijava. Provjerite podatke.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center " style="margin-top: 160px" >
      <div className="bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 p-10 rounded-xl shadow-xl w-96">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Prijava</h2>
        <input
          type="email"
          placeholder="Email"
          className="border-2 border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onInput={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Lozinka"
          className="border-2 border-gray-300 p-3 mb-6 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onInput={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out" onClick={handleLogin}>
          Prijavi se
        </button>
        <p class="text-sm font-light text-center text-white-600 mt-4">
          Nemate račun? <a href="/Register" class="font-medium  hover:underline text-primary-500 text-white hover:text-info ">Registracija</a>
        </p>
        {error() && <p className="text-red-500 text-center mt-4">{error()}</p>}
      </div>
    </div>
  );
}

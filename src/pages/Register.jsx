import { createSignal } from "solid-js";
import { supabase } from "../services/supabase";
import { useNavigate, A } from "@solidjs/router";

export default function Register(props) {
  const navigate = useNavigate();

  const [result, setResult] = createSignal(null);

  async function formSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const email = formData.get("email");
    const password = formData.get("password");

    const result = await supabase.auth.signUp({
      email: email,
      password: password
    });

    console.log(result);
    if (result.error?.code === "invalid_credentials") {
      setResult("Pogrešna e-mail adresa i/ili zaporka.");
    } else if (result.error) {
      setResult("Dogodila se greška prilikom prijave.");
    } else {
      setResult("Prijava je uspjela.");
      navigate("/Home", { replace: true });
    }
  }

  return (
    <>
      <Show when={result()}>
        <div class="bg-slate-300 p-4 rounded">
          {result()}
        </div>
      </Show>
      <form onSubmit={formSubmit}>
        <div className="flex flex-col items-center justify-center "style="margin-top: 160px">
        <div className="bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 p-10 rounded-xl shadow-xl w-96">
          <h2 className="text-3xl font-bold text-center text-white mb-6">Registracija</h2>
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="border-2 border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Lozinka"
            className="border-2 border-gray-300 p-3 mb-6 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div class="p-2 flex flex-col gap-1">
            <input type="submit" value="Registriraj se" class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out" />
          </div>
          <p className="text-sm font-light text-center text-white-600 mt-4">
                  Već imate račun?{" "}
                  <A
                    href="/login"
                    className="font-medium  hover:underline text-primary-500 text-white hover:text-info"
                  >
                    Prijavite se ovdje.
                  </A>
                </p>
        </div>
        </div>
      </form>
    </>
  );
}
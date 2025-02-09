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
        <div className="flex flex-col items-center p-6">
          <h2 className="text-2xl font-bold mb-4">Registracija</h2>
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="border p-2 mb-2 w-64"
          />
          <input
            name="password"
            type="password"
            placeholder="Lozinka"
            className="border p-2 mb-2 w-64"
          />
          <div class="p-2 flex flex-col gap-1">
            <input type="submit" value="Registriraj se" class="bg-slate-600 text-white p-2 rounded" />
          </div>
          <p className="text-sm font-light  text-white">
                  Već imate račun?{" "}
                  <A
                    href="/login"
                    className="text-white hover:text-info font-medium  hover:underline text-primary-500"
                  >
                    Prijavite se ovdje.
                  </A>
                </p>
        </div>
      </form>
    </>
  );
}
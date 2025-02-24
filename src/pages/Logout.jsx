import { createSignal, onMount, Show } from "solid-js";
import { supabase } from "../services/supabase";


export default function Logout(props) {
  const [result, setResult] = createSignal(null);

    onMount(async () => {
        const result = supabase.auth.signOut();
        if (result.error) {
            setResult("Odjava nije uspjela!");
        } else {
            setResult("Odjava je uspjela.");
        }
    });

    return (
        <>
            <Show when={result()}>
                <div class="bg-green-500 p-4 rounded">
                    {result()}
                </div>
            </Show>
        </>
    );
}

import { createSignal, onMount, Show } from "solid-js";
import { pb } from "../services/pocketbase";

export default function Logout(props) {
  const [result, setResult] = createSignal(null);

  onMount(() => {
    try {
      pb.authStore.clear();
      setResult("Odjava je uspjela.");
    } catch (error) {
      setResult("Odjava nije uspjela!");
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
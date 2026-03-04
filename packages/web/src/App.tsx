import { useGameStore } from "./store/gameStore.js";
import { MapCanvas } from "./map/MapCanvas.jsx";

export function App() {
  const { state, hash } = useGameStore();

  return (
    <div style={{ padding: 16, fontFamily: "system-ui" }}>
      <h1>Red Age — Phase 5A Bootstrap</h1>
      <p>
        State hash: <code>{hash}</code>
      </p>
      <MapCanvas />
    </div>
  );
}

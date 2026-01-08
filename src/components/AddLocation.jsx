import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AddLocation({ userId }) {
  const [label, setLabel] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const { data, error } = await supabase
      .from("locations")
      .insert([
        { user_id: userId, label, lat: parseFloat(lat), lon: parseFloat(lon) }
      ]);

    if (error) console.error(error);
    else console.log("Location saved:", data);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={label}
        onChange={e => setLabel(e.target.value)}
        placeholder="Label"
        required
      />
      <input
        value={lat}
        onChange={e => setLat(e.target.value)}
        placeholder="Latitude"
        required
      />
      <input
        value={lon}
        onChange={e => setLon(e.target.value)}
        placeholder="Longitude"
        required
      />
      <button type="submit">Add Location</button>
    </form>
  );
}

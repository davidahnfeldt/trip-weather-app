import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AddLocation({ user, onLocationAdded }) {
  const [label, setLabel] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!label || !lat || !lon) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.from("locations").insert([
      {
        user_id: user.id, // ✅ critical for dynamic dropdown
        label,
        lat,
        lon,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Error adding location:", error);
      alert("Failed to add location. Check console.");
    } else {
      console.log("Location added:", data);
      setLabel("");
      setLat("");
      setLon("");

      // Optional: refresh the parent list of locations
      if (onLocationAdded) onLocationAdded();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Label:
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
        </label>
      </div>

      <div>
        <label>
          Latitude:
          <input
            type="number"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            required
          />
        </label>
      </div>

      <div>
        <label>
          Longitude:
          <input
            type="number"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            required
          />
        </label>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Location"}
      </button>
    </form>
  );
}

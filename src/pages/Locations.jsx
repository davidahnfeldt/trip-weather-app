import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import AddLocation from "../components/AddLocation";

export default function LocationsPage({ user }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchLocations() {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("user_id", user.id)
        .order("label", { ascending: true });

      if (error) console.error(error);
      else setLocations(data);

      setLoading(false);
    }

    fetchLocations();
  }, [user]);

  if (loading) return <p>Loading...</p>;

  if (!user) return <p>You are not logged in. Go to Login.</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
      <h1>My Locations</h1>

      {/* Add location form */}
      <AddLocation userId={user.id} />

      {/* List saved locations */}
      <h2>Saved Locations:</h2>
      {locations.length === 0 ? (
        <p>No locations saved yet.</p>
      ) : (
        <ul>
          {locations.map(loc => (
            <li key={loc.id}>
              <strong>{loc.label}</strong> — Lat: {loc.lat}, Lon: {loc.lon}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

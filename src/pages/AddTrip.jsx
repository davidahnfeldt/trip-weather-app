import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function AddTrip({ user }) {
  const [locations, setLocations] = useState([]);
  const [locationId, setLocationId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Load locations for this user
  const loadLocations = async () => {
    if (!user) return; // wait until user is available

    const { data, error } = await supabase
      .from("locations") // lowercase table name
      .select("*")
      .eq("user_id", user.id)
      .order("label", { ascending: true });

    if (error) console.error("Error loading locations:", error);
    else setLocations(data);
  };

  useEffect(() => {
    loadLocations();
  }, [user]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!locationId || !startDate || !endDate) {
      alert("Please select a location and both dates.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.from("trips").insert([
      {
        user_id: user.id,
        location_id: locationId,
        start_date: startDate,
        end_date: endDate,
        notes: notes || null,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Error adding trip:", error);
      alert("Failed to add trip. Check console.");
    } else {
      console.log("Trip added:", data);
      navigate("/trips"); // redirect back to trips list
    }
  };

  if (!user) return <p>Loading user...</p>; // safe guard

  return (
    <div>
      <h1>Add Trip</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Location:
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              required
            >
              <option value="">Select a location</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Notes (optional):
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Trip"}
        </button>
      </form>
    </div>
  );
}

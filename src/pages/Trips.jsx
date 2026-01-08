import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; // make sure your supabase client is in lib/supabase.js
import { useNavigate } from "react-router-dom";

export default function Trips({ user }) {
  const [trips, setTrips] = useState([]);
  const [locations, setLocations] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const navigate = useNavigate();

  // Load user's trips
  useEffect(() => {
    if (!user) return;
    
    const loadTrips = async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", user.id)
        .order("start_date", { ascending: true });

      if (error) console.error("Error loading trips:", error);
      else setTrips(data);
    };

    loadTrips();
  }, [user]);

  // Load user's locations
  useEffect(() => {
    if (!user) return;
    
    const loadLocations = async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("user_id", user.id)
        .order("label", { ascending: true });

      if (error) console.error("Error loading locations:", error);
      else setLocations(data);
    };

    loadLocations();
  }, [user]);

  // Fetch weather for a specific trip
  const fetchWeather = async (trip) => {
    const location = locations.find((l) => l.id === trip.location_id);

    if (!location) {
      console.error("Location not found for trip:", trip);
      return;
    }

    const lat = location.lat;
    const lon = location.lon;

    if (!lat || !lon) {
      console.error("Latitude or longitude missing for location:", location);
      return;
    }

    try {
      const res = await fetch(`/.netlify/functions/getWeather?lat=${lat}&lon=${lon}`);
      const data = await res.json();

      if (res.status !== 200) {
        console.error("Failed to fetch weather:", data);
        return;
      }

      setWeatherData((prev) => ({ ...prev, [trip.id]: data }));
      console.log("Weather data for trip:", data);
    } catch (err) {
      console.error("Failed to fetch weather:", err);
    }
  };

  return (
    <div>
      <h1>My Trips</h1>

      {/* Add Trip Button */}
      <button
        onClick={() => navigate("/add-trip")}
        style={{ marginBottom: "20px" }}
      >
        Add Trip
      </button>

      {/* Trips List */}
      {trips.length === 0 ? (
        <p>No trips yet. Add one above!</p>
      ) : (
        <ul>
          {trips.map((trip) => {
            const weather = weatherData[trip.id];
            const location = locations.find((l) => l.id === trip.location_id);

            return (
              <li key={trip.id} style={{ marginBottom: "20px" }}>
                <strong>{location ? location.label : "Unknown location"}</strong>
                <br />
                {trip.start_date} → {trip.end_date}
                <br />
                {trip.notes && <em>Notes: {trip.notes}</em>}
                <br />
                <button onClick={() => fetchWeather(trip)}>View Weather</button>
                {weather && (
                  <div style={{ marginTop: "10px" }}>
                    <strong>Weather:</strong> {weather.weather[0].description}, Temp:{" "}
                    {weather.main.temp}°F
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}



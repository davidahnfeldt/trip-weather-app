import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Trips from "./pages/Trips";
import Locations from "./pages/Locations";
import AddTrip from "./pages/AddTrip";
import AddLocation from "./pages/AddLocation"; // make sure path is correct


function App() {
  const [user, setUser] = useState(null);

  // Check session on app load
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    // Listen for changes in auth state (login / logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/trips" element={<Trips user={user} />} />
        <Route path="/locations" element={<Locations user={user} />} />
        <Route path="/add-trip" element={<AddTrip user={user} />} />
        <Route path="/add-location" element={<AddLocation user={user} />} />


      </Routes>
    </Router>
  );
}

export default App;





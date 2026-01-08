import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";

export default function Home({ user }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login"); // redirect to login page
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Trip Weather App</h1>

      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          
          <nav style={{ margin: "2rem 0" }}>
            <Link to="/trips" style={{ marginRight: "1rem", padding: "0.5rem 1rem", background: "#007bff", color: "white", textDecoration: "none", borderRadius: "4px", display: "inline-block" }}>
              My Trips
            </Link>
            <Link to="/locations" style={{ marginRight: "1rem", padding: "0.5rem 1rem", background: "#28a745", color: "white", textDecoration: "none", borderRadius: "4px", display: "inline-block" }}>
              My Locations
            </Link>
          </nav>

          <button onClick={handleSignOut} style={{ padding: "0.5rem 1rem", fontSize: "16px", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Sign Out
          </button>
        </div>
      ) : (
        <p>
          You are not logged in. <a href="/login">Go to Login</a>
        </p>
      )}
    </div>
  );
}

  
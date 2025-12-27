import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Locations from "./pages/Locations";
import Trips from "./pages/Trips";

export default function App() {
  return (
    <>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/login">Login</Link> |{" "}
        <Link to="/locations">Locations</Link> |{" "}
        <Link to="/trips">Trips</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/trips" element={<Trips />} />
      </Routes>
    </>
  );
}




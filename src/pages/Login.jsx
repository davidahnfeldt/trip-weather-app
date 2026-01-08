import { supabase } from "../lib/supabase";

export default function Login() {
  // Function that triggers Google login
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error("Error signing in:", error.message);
    } else {
      console.log("Login started:", data);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Login Page</h1>
      <button onClick={signInWithGoogle} style={{ padding: "1rem", fontSize: "16px" }}>
        Sign in with Google
      </button>
    </div>
  );
}

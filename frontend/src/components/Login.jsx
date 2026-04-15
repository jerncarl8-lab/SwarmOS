import { useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL;

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    const res = await axios.post(`${API}/api/login`, { email });
    setUser(res.data);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>
      <input
        data-testid="login-email-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={{ padding: 8, marginRight: 8, border: "1px solid #ccc", borderRadius: 4 }}
      />
      <button
        data-testid="login-submit-button"
        onClick={handleLogin}
        style={{ padding: "8px 16px", background: "#3B82F6", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
      >
        Login
      </button>
    </div>
  );
}

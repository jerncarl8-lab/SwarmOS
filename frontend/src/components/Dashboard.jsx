import { useEffect, useState } from "react";
import axios from "axios";
import Stats from "@/components/Stats";

const API = process.env.REACT_APP_BACKEND_URL;

export default function Dashboard({ user }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${API}/api/stats`).then((res) => {
      setStats(res.data);
    });
  }, []);

  const subscribe = async () => {
    const res = await axios.post(`${API}/api/subscribe`, {
      email: user.email,
      origin_url: window.location.origin
    });
    window.location.href = res.data.url;
  };

  return (
    <div style={{ padding: 40 }}>
      <h1 data-testid="dashboard-welcome">Welcome {user.email}</h1>
      {stats && <Stats stats={stats} />}
      <button
        data-testid="upgrade-button"
        onClick={subscribe}
        style={{ marginTop: 20, padding: "10px 20px", background: "#3B82F6", color: "white", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 16 }}
      >
        Upgrade
      </button>
    </div>
  );
}

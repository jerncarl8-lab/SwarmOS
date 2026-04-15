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

  return (
    <div style={{ padding: 40 }}>
      <h1 data-testid="dashboard-welcome">Welcome {user.email}</h1>
      {stats && <Stats stats={stats} />}
    </div>
  );
}

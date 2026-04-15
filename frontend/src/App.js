import { useState, useEffect } from "react";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Sidebar from "@/layout/Sidebar";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL;

export default function App() {
  const [user, setUser] = useState({ email: "demo@test.com" });
  const [stats, setStats] = useState(null);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/stats`).then((res) => {
      setStats(res.data);
    });
  }, []);

  if (!onboarded) {
    return <Onboarding setUserData={() => setOnboarded(true)} />;
  }

  return (
    <div className="flex">
      <Sidebar />
      {stats && <Dashboard user={user} stats={stats} />}
    </div>
  );
}

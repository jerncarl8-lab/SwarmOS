import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KPI from "@/components/KPI";
import Card from "@/components/Card";
import Topbar from "@/layout/Topbar";
import Sidebar from "@/layout/Sidebar";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL;

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/app");
      return;
    }
    setUser(JSON.parse(stored));

    axios.get(`${API}/api/stats`).then((res) => {
      setStats(res.data);
    });
  }, [navigate]);

  if (!user || !stats) return <p>Loading...</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 w-full">
        <Topbar user={user} />

        <div className="grid grid-cols-3 gap-4 mb-6">
          <KPI label="Emails Sent" value={stats.sent} />
          <KPI label="Replies" value={stats.replies} />
          <KPI label="Meetings Booked" value={stats.booked} />
        </div>

        <Card>
          <h3 className="font-semibold mb-2">Activity</h3>
          <p className="text-gray-500">
            We book meetings for you automatically.
          </p>
        </Card>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Home, BarChart3, Mail, Calendar, Settings, LogOut, Zap, ArrowUpRight } from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL;

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [currentView, setCurrentView] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/app"); return; }
    setUser(JSON.parse(stored));
    axios.get(`${API}/api/stats`).then((res) => setStats(res.data));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("onboarding");
    navigate("/");
  };

  const handleUpgrade = async (plan = "starter") => {
    try {
      const res = await axios.post(`${API}/api/subscribe`, {
        email: user.email,
        plan,
        origin_url: window.location.origin,
      });
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "outreach", label: "Outreach", icon: Mail },
    { id: "meetings", label: "Meetings", icon: Calendar },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside data-testid="dashboard-sidebar" className="w-64 bg-white border-r border-gray-200 flex flex-col p-4">
        <h1 className="text-xl font-semibold tracking-tight px-3 mb-8">SwarmOS</h1>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                data-testid={`nav-${item.id}`}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? "bg-black text-white"
                    : "text-gray-600 hover:text-black hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Upgrade card */}
        {user.plan === "free" && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-black" />
              <p className="text-sm font-medium">Upgrade to Pro</p>
            </div>
            <p className="text-xs text-gray-500 mb-3">Unlimited emails & auto booking</p>
            <button
              data-testid="upgrade-btn"
              onClick={() => handleUpgrade("starter")}
              className="w-full bg-black text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors font-medium"
            >
              $99/mo
            </button>
          </div>
        )}

        {/* Logout */}
        <button
          data-testid="logout-btn"
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {/* Topbar */}
        <div data-testid="dashboard-topbar" className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-medium tracking-tight">
              {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {user.plan} plan
            </span>
          </div>
        </div>

        {currentView === "dashboard" && <DashboardView stats={stats} />}
        {currentView === "outreach" && <OutreachView />}
        {currentView === "meetings" && <MeetingsView />}
        {currentView === "analytics" && <AnalyticsView stats={stats} />}
        {currentView === "settings" && <SettingsView user={user} />}
      </main>
    </div>
  );
}

function KPICard({ label, value, subtitle }) {
  return (
    <div data-testid={`kpi-${label.toLowerCase().replace(/\s/g, "-")}`} className="bg-white border border-gray-200 rounded-xl p-6">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-4xl font-semibold tracking-tight mt-2">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}

function DashboardView({ stats }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard label="Emails Sent" value={stats.sent} subtitle="total outreach" />
        <KPICard label="Replies" value={stats.replies} subtitle={`${stats.replyRate}% reply rate`} />
        <KPICard label="Meetings Booked" value={stats.booked} subtitle="qualified calls" />
        <KPICard label="Total Leads" value={stats.leads} subtitle={`${stats.contacted} contacted`} />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium tracking-tight">Activity</h3>
          <ArrowUpRight size={16} className="text-gray-400" />
        </div>
        <p className="text-sm text-gray-500">
          We book meetings for you automatically. Your AI agents are actively prospecting and following up with leads.
        </p>
      </div>
    </div>
  );
}

function OutreachView() {
  const [outreach, setOutreach] = useState([]);
  useEffect(() => {
    axios.get(`${API}/api/outreach`).then((res) => setOutreach(res.data.data || []));
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-medium tracking-tight mb-4">Outreach History</h3>
      {outreach.length === 0 ? (
        <p className="text-sm text-gray-500">No outreach sent yet. Your AI is warming up.</p>
      ) : (
        <div className="space-y-3">
          {outreach.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium">{item.company}</p>
                <p className="text-xs text-gray-500">{item.email}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${item.replied ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {item.replied ? "Replied" : "Sent"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MeetingsView() {
  const [meetings, setMeetings] = useState([]);
  useEffect(() => {
    axios.get(`${API}/api/meetings`).then((res) => setMeetings(res.data.data || []));
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-medium tracking-tight mb-4">Booked Meetings</h3>
      {meetings.length === 0 ? (
        <p className="text-sm text-gray-500">No meetings booked yet. They'll appear here once leads respond.</p>
      ) : (
        <div className="space-y-3">
          {meetings.map((m) => (
            <div key={m.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium">Lead #{m.leadId}</p>
                <p className="text-xs text-gray-500">{new Date(m.scheduledAt).toLocaleDateString()}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-black text-white">{m.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AnalyticsView({ stats }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard label="Reply Rate" value={`${stats.replyRate}%`} />
        <KPICard label="Conversion" value={`${stats.conversionRate}%`} />
        <KPICard label="Contacted" value={stats.contacted} />
      </div>
    </div>
  );
}

function SettingsView({ user }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-medium tracking-tight mb-4">Account</h3>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-sm font-medium">{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Organization</p>
          <p className="text-sm font-medium">{user.orgId}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Plan</p>
          <p className="text-sm font-medium capitalize">{user.plan}</p>
        </div>
      </div>
    </div>
  );
}

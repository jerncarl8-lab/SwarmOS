import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Home, BarChart3, Mail, Calendar, Settings, LogOut, Zap, ArrowUpRight, BookOpen, Phone, Target, MessageSquare, Clock, DollarSign, Users, ChevronDown, ChevronUp, TrendingUp, Check } from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL;

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [currentView, setCurrentView] = useState("dashboard");
  const [onboardingData, setOnboardingData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/app"); return; }
    setUser(JSON.parse(stored));
    const onboardingStored = localStorage.getItem("onboarding");
    if (onboardingStored) {
      setOnboardingData(JSON.parse(onboardingStored));
    }
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
        ref: onboardingData?.ref || undefined,
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
    { id: "marketplace", label: "Marketplace", icon: Users },
    { id: "automation", label: "Automation", icon: Zap },
    { id: "playbook", label: "Playbook", icon: BookOpen },
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
        {currentView === "marketplace" && <MarketplaceView />}
        {currentView === "automation" && <AutomationView />}
        {currentView === "playbook" && <PlaybookView />}
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
  const [showAdd, setShowAdd] = useState(false);
  const [newLead, setNewLead] = useState({ firstName: "", email: "", company: "" });
  const [adding, setAdding] = useState(false);

  const addLead = async () => {
    if (!newLead.email || !newLead.company || !newLead.firstName) return;
    setAdding(true);
    try {
      await axios.post(`${API}/api/leads`, newLead);
      setNewLead({ firstName: "", email: "", company: "" });
      setShowAdd(false);
      window.location.reload();
    } catch (err) { console.error(err); }
    setAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard label="Emails Sent" value={stats.sent} subtitle="total outreach" />
        <KPICard label="Replies" value={stats.replies} subtitle={`${stats.replyRate}% reply rate`} />
        <KPICard label="Meetings Booked" value={stats.booked} subtitle="qualified calls" />
        <KPICard label="Total Leads" value={stats.leads} subtitle={`${stats.contacted} contacted`} />
      </div>

      {/* Add Lead */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium tracking-tight">Quick Actions</h3>
        </div>
        {!showAdd ? (
          <button
            data-testid="add-lead-btn"
            onClick={() => setShowAdd(true)}
            className="text-sm bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors font-medium"
          >
            + Add Lead
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              data-testid="add-lead-name"
              placeholder="First name"
              value={newLead.firstName}
              onChange={(e) => setNewLead({ ...newLead, firstName: e.target.value })}
              className="border border-gray-300 rounded-xl px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <input
              data-testid="add-lead-email"
              placeholder="Email"
              value={newLead.email}
              onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
              className="border border-gray-300 rounded-xl px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <input
              data-testid="add-lead-company"
              placeholder="Company"
              value={newLead.company}
              onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
              className="border border-gray-300 rounded-xl px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <button
              data-testid="add-lead-submit"
              onClick={addLead}
              disabled={adding}
              className="text-sm bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40"
            >
              {adding ? "Adding..." : "Add"}
            </button>
            <button onClick={() => setShowAdd(false)} className="text-sm text-gray-500 hover:text-black px-2">Cancel</button>
          </div>
        )}
      </div>

      {/* Activity */}
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
  const [leads, setLeads] = useState([]);
  const [sending, setSending] = useState(null);

  const fetchData = () => {
    axios.get(`${API}/api/outreach`).then((res) => setOutreach(res.data.data || []));
    axios.get(`${API}/api/leads`).then((res) => setLeads(res.data.data || []));
  };

  useEffect(() => { fetchData(); }, []);

  const sendToLead = async (leadId) => {
    setSending(leadId);
    try {
      await axios.post(`${API}/api/outreach/send`, { leadId });
      fetchData();
    } catch (err) { console.error(err); }
    setSending(null);
  };

  const uncontacted = leads.filter((l) => !l.contacted);

  return (
    <div className="space-y-6">
      {/* Send to new leads */}
      {uncontacted.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-medium tracking-tight mb-4">Send AI Outreach</h3>
          <p className="text-sm text-gray-500 mb-4">{uncontacted.length} leads waiting for outreach</p>
          <div className="space-y-2">
            {uncontacted.slice(0, 5).map((lead, idx) => (
              <div key={`${lead.id}-${idx}`} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium">{lead.firstName} - {lead.company}</p>
                  <p className="text-xs text-gray-500">{lead.email}</p>
                </div>
                <button
                  data-testid={`send-to-${lead.id}`}
                  onClick={() => sendToLead(lead.id)}
                  disabled={sending === lead.id}
                  className="text-xs bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40"
                >
                  {sending === lead.id ? "Generating..." : "Send AI Email"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Outreach history */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-medium tracking-tight mb-4">Outreach History</h3>
        {outreach.length === 0 ? (
          <p className="text-sm text-gray-500">No outreach sent yet. Send your first AI email above.</p>
        ) : (
          <div className="space-y-3">
            {outreach.map((item) => (
              <div key={item.id} className="border-b border-gray-100 last:border-0 py-3">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-sm font-medium">{item.company}</p>
                    <p className="text-xs text-gray-500">{item.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${item.replied ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {item.replied ? `Replied (${item.sentiment})` : "Sent"}
                  </span>
                </div>
                {item.content && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.content}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
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
        <p className="text-sm text-gray-500">No meetings booked yet. They will appear here once leads respond.</p>
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

function AutomationView() {
  const [status, setStatus] = useState(null);
  const [runningAction, setRunningAction] = useState(null);

  const loadStatus = () => {
    axios.get(`${API}/api/automation/status`).then((res) => setStatus(res.data.data));
  };

  useEffect(() => { loadStatus(); }, []);

  const trigger = async (endpoint, key) => {
    setRunningAction(key);
    try {
      await axios.post(`${API}${endpoint}`);
      loadStatus();
    } catch (err) {
      console.error(err);
    }
    setRunningAction(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-medium tracking-tight mb-2">Automation Control</h3>
        <p className="text-sm text-gray-500 mb-4">Start background follow-ups + auto-meeting booking.</p>
        <div className="flex gap-3">
          <button onClick={() => trigger("/api/automation/start", "start")} disabled={runningAction === "start"} className="bg-black text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40">
            {runningAction === "start" ? "Starting..." : "Start"}
          </button>
          <button onClick={() => trigger("/api/automation/stop", "stop")} disabled={runningAction === "stop"} className="bg-gray-200 text-gray-800 text-sm px-4 py-2 rounded-xl hover:bg-gray-300 transition-colors disabled:opacity-40">
            {runningAction === "stop" ? "Stopping..." : "Stop"}
          </button>
          <button onClick={() => trigger("/api/automation/run-once", "run")} disabled={runningAction === "run"} className="bg-blue-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-40">
            {runningAction === "run" ? "Running..." : "Run Once"}
          </button>
          <button onClick={loadStatus} className="bg-white border border-gray-300 text-sm px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="text-base font-medium mb-3">Status</h4>
        {!status ? (
          <p className="text-sm text-gray-500">Loading status...</p>
        ) : (
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Running:</span> <span className="font-medium">{status.running ? "Yes" : "No"}</span></p>
            <p><span className="text-gray-500">Last Run:</span> <span className="font-medium">{status.lastRunAt || "Never"}</span></p>
            <p><span className="text-gray-500">Follow-ups Sent:</span> <span className="font-medium">{status.lastSummary?.followupsSent ?? 0}</span></p>
            <p><span className="text-gray-500">Meetings Booked:</span> <span className="font-medium">{status.lastSummary?.meetingsBooked ?? 0}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}

function MarketplaceView() {
  const [overview, setOverview] = useState(null);
  const [providers, setProviders] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [matches, setMatches] = useState([]);
  const [providerForm, setProviderForm] = useState({ name: "", email: "", services: "", location: "" });
  const [jobForm, setJobForm] = useState({ customerName: "", customerEmail: "", description: "", category: "", location: "" });
  const [matchingJobId, setMatchingJobId] = useState(null);

  const load = () => {
    axios.get(`${API}/api/marketplace/overview`).then((res) => setOverview(res.data.data)).catch(() => {});
    axios.get(`${API}/api/providers`).then((res) => setProviders(res.data.data || []));
    axios.get(`${API}/api/jobs`).then((res) => setJobs(res.data.data || []));
    axios.get(`${API}/api/match-runs`).then((res) => setMatches(res.data.data || []));
  };

  useEffect(() => { load(); }, []);

  const addProvider = async () => {
    if (!providerForm.name || !providerForm.email) return;
    try {
      await axios.post(`${API}/api/providers`, {
        ...providerForm,
        services: providerForm.services.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setProviderForm({ name: "", email: "", services: "", location: "" });
      load();
    } catch (err) { console.error(err); }
  };

  const addJob = async () => {
    if (!jobForm.customerName || !jobForm.customerEmail || !jobForm.description) return;
    try {
      await axios.post(`${API}/api/jobs`, jobForm);
      setJobForm({ customerName: "", customerEmail: "", description: "", category: "", location: "" });
      load();
    } catch (err) { console.error(err); }
  };

  const matchJob = async (jobId) => {
    setMatchingJobId(jobId);
    try {
      await axios.post(`${API}/api/jobs/${jobId}/match`, { topK: 5 });
      load();
    } catch (err) { console.error(err); }
    setMatchingJobId(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard label="Providers" value={overview?.providers ?? 0} />
        <KPICard label="Active Providers" value={overview?.activeProviders ?? 0} />
        <KPICard label="Jobs" value={overview?.jobs ?? 0} />
        <KPICard label="Matched Jobs" value={overview?.matchedJobs ?? 0} />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-medium tracking-tight mb-4">Add Provider</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input placeholder="Name" value={providerForm.name} onChange={(e) => setProviderForm({ ...providerForm, name: e.target.value })} className="border border-gray-300 rounded-xl px-3 py-2 text-sm" />
          <input placeholder="Email" value={providerForm.email} onChange={(e) => setProviderForm({ ...providerForm, email: e.target.value })} className="border border-gray-300 rounded-xl px-3 py-2 text-sm" />
          <input placeholder="Services (comma separated)" value={providerForm.services} onChange={(e) => setProviderForm({ ...providerForm, services: e.target.value })} className="border border-gray-300 rounded-xl px-3 py-2 text-sm" />
          <input placeholder="Location" value={providerForm.location} onChange={(e) => setProviderForm({ ...providerForm, location: e.target.value })} className="border border-gray-300 rounded-xl px-3 py-2 text-sm" />
        </div>
        <button onClick={addProvider} className="mt-3 bg-black text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-800">Save Provider</button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-medium tracking-tight mb-4">Create Customer Job</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input placeholder="Customer Name" value={jobForm.customerName} onChange={(e) => setJobForm({ ...jobForm, customerName: e.target.value })} className="border border-gray-300 rounded-xl px-3 py-2 text-sm" />
          <input placeholder="Customer Email" value={jobForm.customerEmail} onChange={(e) => setJobForm({ ...jobForm, customerEmail: e.target.value })} className="border border-gray-300 rounded-xl px-3 py-2 text-sm" />
          <input placeholder="Category (optional)" value={jobForm.category} onChange={(e) => setJobForm({ ...jobForm, category: e.target.value })} className="border border-gray-300 rounded-xl px-3 py-2 text-sm" />
          <input placeholder="Location (optional)" value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} className="border border-gray-300 rounded-xl px-3 py-2 text-sm md:col-span-1" />
          <input placeholder="Description" value={jobForm.description} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} className="border border-gray-300 rounded-xl px-3 py-2 text-sm md:col-span-2" />
        </div>
        <button onClick={addJob} className="mt-3 bg-black text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-800">Create Job</button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-medium tracking-tight mb-4">Jobs & Matching</h3>
        {jobs.length === 0 ? (
          <p className="text-sm text-gray-500">No jobs yet.</p>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <p className="text-sm font-medium">{job.customerName} - {job.category || "general"}</p>
                  <p className="text-xs text-gray-500">{job.description}</p>
                </div>
                <button onClick={() => matchJob(job.id)} disabled={matchingJobId === job.id} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-40">
                  {matchingJobId === job.id ? "Matching..." : "Match Providers"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-medium tracking-tight mb-4">Recent Match Runs</h3>
        {matches.length === 0 ? (
          <p className="text-sm text-gray-500">No matches yet.</p>
        ) : (
          <div className="space-y-3">
            {matches.slice(0, 8).map((run) => (
              <div key={run.id} className="border border-gray-100 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Job: {run.jobId}</p>
                <p className="text-sm font-medium">
                  Top match: {run.matches?.[0]?.providerName || "N/A"} ({run.matches?.[0]?.score ?? 0})
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-medium tracking-tight mb-4">Providers</h3>
        {providers.length === 0 ? (
          <p className="text-sm text-gray-500">No providers yet.</p>
        ) : (
          <div className="space-y-2">
            {providers.map((p) => (
              <div key={p.id} className="text-sm border-b border-gray-100 pb-2">
                <span className="font-medium">{p.name}</span>
                <span className="text-gray-500"> - {p.location || "N/A"} - {Array.isArray(p.services) ? p.services.join(", ") : ""}</span>
              </div>
            ))}
          </div>
        )}
      </div>
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


function PlaybookView() {
  const [openSection, setOpenSection] = useState("script");
  const toggle = (id) => setOpenSection(openSection === id ? null : id);

  return (
    <div className="space-y-6">
      {/* Daily Schedule */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center"><Clock size={18} className="text-white" /></div>
          <div>
            <h3 className="text-lg font-medium tracking-tight">Daily Operating System</h3>
            <p className="text-xs text-gray-500">Follow this every day</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ScheduleBlock time="Morning (1-2h)" color="bg-blue-50 border-blue-100" items={["Check dashboard & replies", "Confirm bookings", "Fix any issues"]} />
          <ScheduleBlock time="Midday" color="bg-green-50 border-green-100" items={["Take calls", "Close deals", "Send follow-ups"]} />
          <ScheduleBlock time="Evening" color="bg-purple-50 border-purple-100" items={["Review stats", "Improve messaging", "Add new leads"]} />
        </div>
      </div>

      {/* KPI Targets */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center"><Target size={18} className="text-white" /></div>
          <div>
            <h3 className="text-lg font-medium tracking-tight">Daily KPI Targets</h3>
            <p className="text-xs text-gray-500">Hit these numbers every day</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TargetCard label="Messages Sent" target="200-1000" icon={<Mail size={16} />} />
          <TargetCard label="Replies" target="10-50" icon={<MessageSquare size={16} />} />
          <TargetCard label="Calls Booked" target="5-15" icon={<Phone size={16} />} />
          <TargetCard label="Deals Closed" target="1-3" icon={<DollarSign size={16} />} />
        </div>
      </div>

      {/* Call Script */}
      <PlaybookSection
        id="script"
        open={openSection === "script"}
        toggle={() => toggle("script")}
        icon={<Phone size={18} />}
        title="Call Script"
        subtitle="Word-for-word what to say on sales calls"
      >
        <div className="space-y-4">
          <ScriptStep num="1" title="Opening" color="bg-green-50">
            <p>"Hey, thanks for taking the call - I will keep this super simple. I just want to understand how you are currently getting customers, and if it makes sense I will show you how we can help. Sound fair?"</p>
          </ScriptStep>
          <ScriptStep num="2" title="Discovery" color="bg-yellow-50">
            <p>"How are you getting new customers today?"</p>
            <p>"How many meetings are you getting per week?"</p>
            <p>"Are you happy with that or do you want more?"</p>
            <p>"What is the biggest bottleneck right now?"</p>
          </ScriptStep>
          <ScriptStep num="3" title="Problem" color="bg-red-50">
            <p>"So basically, you want more consistent meetings, but [their problem]."</p>
          </ScriptStep>
          <ScriptStep num="4" title="Offer" color="bg-purple-50">
            <p>"Got it - so what we do is pretty simple. We handle the outbound for you and book meetings directly into your calendar."</p>
            <p className="font-medium mt-2">"So instead of you chasing leads, the system brings them to you."</p>
          </ScriptStep>
          <ScriptStep num="5" title="Result" color="bg-blue-50">
            <p>"Most clients use this to get an extra 5-20 meetings per month without hiring SDRs."</p>
          </ScriptStep>
          <ScriptStep num="6" title="Close" color="bg-green-50">
            <p>"If we could do that for you, would that be valuable?"</p>
            <p className="font-medium mt-2">"Do you want me to set this up for you?"</p>
          </ScriptStep>
        </div>
      </PlaybookSection>

      {/* Objection Handling */}
      <PlaybookSection
        id="objections"
        open={openSection === "objections"}
        toggle={() => toggle("objections")}
        icon={<MessageSquare size={18} />}
        title="Objection Handling"
        subtitle="What to say when they push back"
      >
        <div className="space-y-3">
          <ObjectionCard objection="Too expensive" response="Totally fair - but if this brings even 1-2 clients, it pays for itself, right?" />
          <ObjectionCard objection="I need to think" response="Of course - what specifically do you want to think about?" />
          <ObjectionCard objection="Does it work?" response="That is exactly why we start small and test - no long-term risk." />
        </div>
      </PlaybookSection>

      {/* Scale Plan */}
      <PlaybookSection
        id="scale"
        open={openSection === "scale"}
        toggle={() => toggle("scale")}
        icon={<TrendingUp size={18} />}
        title="Scale Plan"
        subtitle="How to grow from $0 to $50K+/month"
      >
        <div className="space-y-3">
          <ScalePhase phase="1" revenue="$0-$5K" desc="You do everything. 200 msgs/day. Close 1-3 clients." />
          <ScalePhase phase="2" revenue="$5K-$20K" desc="Improve scripts. Add follow-ups. Increase volume." />
          <ScalePhase phase="3" revenue="$20K-$50K" desc="Hire a closer. Step back. Focus on growth." />
          <ScalePhase phase="4" revenue="$50K+" desc="Fully systemized. Multiple channels. Predictable revenue." />
        </div>
      </PlaybookSection>

      {/* The Math */}
      <div className="bg-black text-white rounded-xl p-6">
        <h3 className="text-lg font-medium tracking-tight mb-4">The Math</h3>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="bg-white/10 px-3 py-1.5 rounded-lg">1000 messages</span>
          <span className="text-gray-500">→</span>
          <span className="bg-white/10 px-3 py-1.5 rounded-lg">100 replies</span>
          <span className="text-gray-500">→</span>
          <span className="bg-white/10 px-3 py-1.5 rounded-lg">20 calls</span>
          <span className="text-gray-500">→</span>
          <span className="bg-white/20 px-3 py-1.5 rounded-lg font-semibold">5 closed deals</span>
        </div>
        <p className="text-xs text-gray-400 mt-4">At $1,000/client = $5,000/month from one batch of outreach</p>
      </div>
    </div>
  );
}

function ScheduleBlock({ time, color, items }) {
  return (
    <div className={`${color} border rounded-xl p-4`}>
      <p className="text-sm font-medium mb-3">{time}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
            <Check size={12} className="text-gray-400" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TargetCard({ label, target, icon }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
      <div className="mx-auto mb-2 text-gray-500">{icon}</div>
      <p className="text-lg font-semibold tracking-tight">{target}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function PlaybookSection({ id, open, toggle, icon, title, subtitle, children }) {
  return (
    <div data-testid={`playbook-${id}`} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={toggle} className="w-full flex items-center justify-between p-6 text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">{icon}</div>
          <div>
            <h3 className="text-base font-medium tracking-tight">{title}</h3>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}

function ScriptStep({ num, title, color, children }) {
  return (
    <div className={`${color} rounded-xl p-4`}>
      <p className="text-xs font-semibold text-gray-500 mb-1">Step {num}</p>
      <p className="text-sm font-medium mb-2">{title}</p>
      <div className="text-sm text-gray-700 italic space-y-1">{children}</div>
    </div>
  );
}

function ObjectionCard({ objection, response }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-sm font-medium text-red-600 mb-1">{objection}</p>
      <p className="text-sm text-gray-700 italic">{response}</p>
    </div>
  );
}

function ScalePhase({ phase, revenue, desc }) {
  return (
    <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
      <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">{phase}</div>
      <div>
        <p className="text-sm font-medium">{revenue}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </div>
  );
}




export default function Stats({ stats }) {
  return (
    <div data-testid="stats-container" style={{ marginTop: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
        <StatCard label="Leads" value={stats.leads} />
        <StatCard label="Contacted" value={stats.contacted} />
        <StatCard label="Sent" value={stats.sent} />
        <StatCard label="Replies" value={stats.replies} />
        <StatCard label="Booked" value={stats.booked} />
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div
      data-testid={`stat-${label.toLowerCase()}`}
      style={{
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 20,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 28, fontWeight: "bold", color: "#111827" }}>{value}</div>
      <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>{label}</div>
    </div>
  );
}

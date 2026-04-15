export default function KPI({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm">
      <p className="text-gray-500 text-sm">{label}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}

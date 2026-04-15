export default function Topbar({ user }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div className="text-sm text-gray-600">{user.email}</div>
    </div>
  );
}

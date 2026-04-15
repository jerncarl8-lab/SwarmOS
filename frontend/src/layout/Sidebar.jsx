import { Home, BarChart } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-60 h-screen bg-white border-r p-4">
      <h1 className="text-xl font-bold mb-6">SwarmOS</h1>

      <div className="space-y-3">
        <div className="flex items-center gap-2 cursor-pointer">
          <Home size={18} /> Dashboard
        </div>
        <div className="flex items-center gap-2 cursor-pointer">
          <BarChart size={18} /> Analytics
        </div>
      </div>
    </div>
  );
}

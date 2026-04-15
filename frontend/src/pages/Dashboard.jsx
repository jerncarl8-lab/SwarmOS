import KPI from "../components/KPI";
import Card from "../components/Card";
import Topbar from "../layout/Topbar";

export default function Dashboard({ user, stats }) {
  return (
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
          Your AI agents are actively sending outreach and booking meetings.
        </p>
      </Card>
    </div>
  );
}

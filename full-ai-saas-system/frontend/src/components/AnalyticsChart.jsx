import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const mockData = [
  { name: 'Mon', sent: 12, replies: 3, meetings: 1 },
  { name: 'Tue', sent: 15, replies: 5, meetings: 2 },
  { name: 'Wed', sent: 18, replies: 7, meetings: 2 },
  { name: 'Thu', sent: 22, replies: 9, meetings: 3 },
  { name: 'Fri', sent: 25, replies: 10, meetings: 4 },
  { name: 'Sat', sent: 8, replies: 2, meetings: 0 },
  { name: 'Sun', sent: 5, replies: 1, meetings: 0 },
]

export default function AnalyticsChart() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sent" stroke="#3B82F6" strokeWidth={2} />
          <Line type="monotone" dataKey="replies" stroke="#10B981" strokeWidth={2} />
          <Line type="monotone" dataKey="meetings" stroke="#F59E0B" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

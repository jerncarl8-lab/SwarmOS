import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function Stats({ stats }) {
  const data = [
    { name: "Sent", value: stats.sent },
    { name: "Replies", value: stats.replies },
    { name: "Booked", value: stats.booked }
  ];

  return (
    <BarChart width={400} height={300} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" />
    </BarChart>
  );
}

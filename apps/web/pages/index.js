import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Home() {
  const [data, setData] = useState({});

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("swarm", setData);

    return () => socket.disconnect();
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>AI Growth OS Dashboard</h1>
      <p>Agents: {data.agents}</p>
      <p>Revenue: ${data.revenue}</p>
      <p>Conversions: {data.conversions}</p>
    </div>
  );
}
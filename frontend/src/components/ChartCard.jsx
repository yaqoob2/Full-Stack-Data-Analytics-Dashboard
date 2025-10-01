import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ChartCard({ title, data, dataKeyX, dataKeyY }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "10px",
        padding: "20px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
      }}
    >
      <h3
        style={{
          marginBottom: "15px",
          color: "#1E293B",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        {title}
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey={dataKeyX} stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <Tooltip />
          <Line type="monotone" dataKey={dataKeyY} stroke="#00CFFD" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartCard;





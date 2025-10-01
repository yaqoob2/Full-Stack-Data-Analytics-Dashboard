// src/pages/DisputesPage.jsx
import React, { useEffect, useState } from "react";
import { getDisputes, getDisputesAnalytics } from "../api/api";

const DisputesPage = () => {
  const [disputes, setDisputes] = useState([]);
  const [analytics, setAnalytics] = useState({ total: 0, by_status: [] });

  useEffect(() => {
    // Fetch analytics summary
    getDisputesAnalytics()
      .then((res) => setAnalytics(res.data))
      .catch(() => setAnalytics({ total: 0, by_status: [] }));

    // Fetch disputes list
    getDisputes()
      .then((res) => setDisputes(res.data))
      .catch(() => setDisputes([]));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "1.8rem", color: "#00CFFD", marginBottom: "1.5rem" }}>
        ⚖️ Disputes
      </h1>

      {/* ✅ Overview Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <OverviewCard title="Total Disputes" value={analytics.total ?? 0} color="#0EA5E9" />
        <OverviewCard
          title="Open"
          value={getStatusCount(analytics, "Open")}
          color="#EF4444"
        />
        <OverviewCard
          title="Resolved"
          value={getStatusCount(analytics, "Resolved")}
          color="#22C55E"
        />
        <OverviewCard
          title="Pending"
          value={getStatusCount(analytics, "Pending")}
          color="#FACC15"
        />
      </div>

      {/* ✅ Disputes Table */}
      <div
        style={{
          background: "white",
          padding: "1rem",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ marginBottom: "1rem", color: "#1E293B" }}>Disputes List</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead style={{ background: "#F1F5F9" }}>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Raised By</th>
              <th style={thStyle}>Against</th>
              <th style={thStyle}>Reason</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {disputes.length > 0 ? (
              disputes.map((d) => (
                <tr key={d.id}>
                  <td style={tdStyle}>{d.id}</td>
                  <td style={tdStyle}>{d.raised_by}</td>
                  <td style={tdStyle}>{d.against}</td>
                  <td style={tdStyle}>{d.reason}</td>
                  <td
                    style={{
                      ...tdStyle,
                      fontWeight: "bold",
                      color: getStatusColor(d.status),
                    }}
                  >
                    {d.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={tdStyle} colSpan="5">
                  No disputes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ✅ Reuse your OverviewCard component
const OverviewCard = ({ title, value, color }) => (
  <div
    style={{
      background: "#FFFFFF",
      borderLeft: `5px solid ${color}`,
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <h3 style={{ color: "#6B7280", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
      {title}
    </h3>
    <p style={{ fontSize: 22, fontWeight: "bold", color: "#1E293B" }}>{value}</p>
  </div>
);

// ✅ Helpers
const thStyle = {
  textAlign: "left",
  padding: "12px",
  fontWeight: "600",
  color: "#1E293B",
  borderBottom: "1px solid #E2E8F0",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #E2E8F0",
  color: "#475569",
};

const getStatusColor = (status) => {
  if (status === "Open") return "#EF4444";
  if (status === "Resolved") return "#22C55E";
  if (status === "Pending") return "#FACC15";
  return "#475569";
};

const getStatusCount = (analytics, status) => {
  if (!analytics.by_status) return 0;
  const entry = analytics.by_status.find((s) => s.status === status);
  return entry ? entry.count : 0;
};

export default DisputesPage;

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import OverviewCard from "../components/OverviewCard";
import {
  getOverview,
  getJobsByCategory,
  getJobsPerDay,
  getJobsByUser,
  getActiveUsers,
  getDisputesAnalytics,
} from "../api/api";
import { useNavigate } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [overview, setOverview] = useState({});
  const [jobsByCategory, setJobsByCategory] = useState([]);
  const [jobsByUser, setJobsByUser] = useState([]);
  const [jobsPerDay, setJobsPerDay] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [disputes, setDisputes] = useState({ total_disputes: 0 });

  const navigate = useNavigate();

  useEffect(() => {
    getOverview().then((res) => setOverview(res.data));

    getJobsByCategory().then((res) =>
      setJobsByCategory(
        (res.data || []).map((d) => ({ name: d.category, value: d.count }))
      )
    );

    getJobsPerDay().then((res) => {
      const data = res.data?.jobs_per_day || {};
      setJobsPerDay(Object.entries(data).map(([date, count]) => ({ date, count })));
    });

    getJobsByUser().then((res) => {
      const data = res.data?.jobs_by_user || {};
      setJobsByUser(Object.entries(data).map(([name, count]) => ({ name, count })));
    });

    getActiveUsers().then((res) =>
      setActiveUsers(
        (res.data || []).map((item) =>
          Array.isArray(item)
            ? { name: item[0], value: item[1] }
            : { name: item.role, value: item.count }
        )
      )
    );

    getDisputesAnalytics().then((res) => setDisputes(res.data));
  }, []);

  const COLORS = ["#00CFFD", "#22C55E", "#F97316", "#9333EA", "#FF8042", "#9933FF"];

  return (
    <div style={{ display: "flex", backgroundColor: "#F5F7FA", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "2rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#00CFFD",
            marginBottom: "2rem",
          }}
        >
          📊 ConnectHub Analytics
        </h1>

        {/* Overview Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <OverviewCard
            title="Total Users"
            value={overview.total_users ?? 0}
            icon="👤"
            color="#00CFFD"
          />
          <OverviewCard
            title="Total Jobs"
            value={overview.total_jobs ?? 0}
            icon="💼"
            color="#22C55E"
          />
          <OverviewCard
            title="Jobs Today"
            value={overview.jobs_today ?? 0}
            icon="📅"
            color="#F97316"
          />
          <OverviewCard
            title="Jobs This Week"
            value={overview.jobs_this_week ?? 0}
            icon="📊"
            color="#9333EA"
          />
          {/* ✅ Disputes Card with click redirect */}
          <OverviewCard
            title="Total Disputes"
            value={disputes.total_disputes ?? 0}
            icon="⚖️"
            color="#EF4444"
            onClick={() => navigate("/disputes")}
          />
        </div>

        {/* Example Chart Section (you can keep the grid as before) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
          }}
        >
          {/* Jobs by Category */}
          <ChartCardWrapper title="Jobs by Category">
            <PieChartComp data={jobsByCategory} COLORS={COLORS} />
          </ChartCardWrapper>

          {/* Active Users */}
          <ChartCardWrapper title="Active Users by Role">
            <PieChartComp data={activeUsers} COLORS={COLORS} />
          </ChartCardWrapper>

          {/* Jobs Per Day */}
          <ChartCardWrapper title="Jobs Per Day">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={jobsPerDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#22C55E" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCardWrapper>

          {/* Jobs by User */}
          <ChartCardWrapper title="Jobs by User">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={jobsByUser}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#9333EA" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCardWrapper>
        </div>
      </div>
    </div>
  );
};

// ✅ Chart card wrapper
const ChartCardWrapper = ({ title, children }) => (
  <div
    style={{
      background: "white",
      padding: "1rem",
      borderRadius: "10px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    }}
  >
    <h3 style={{ color: "#1E293B", marginBottom: "0.5rem" }}>{title}</h3>
    {children}
  </div>
);

// ✅ Small reusable pie chart component
const PieChartComp = ({ data, COLORS }) => (
  <ResponsiveContainer width="100%" height={220}>
    <PieChart>
      <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

export default Dashboard;

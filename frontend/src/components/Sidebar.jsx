import React from "react";

function Sidebar() {
  return (
    <div
      style={{
        width: "220px",
        background: "#FFFFFF",
        borderRight: "1px solid #E5E7EB",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {/* Logo / App Name */}
      <h2
        style={{
          color: "#00CFFD",
          fontWeight: "bold",
          fontSize: "20px",
          marginBottom: "40px",
        }}
      >
        ConnectHub
      </h2>

      {/* Nav Items */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <li
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "10px",
            background: "#00CFFD",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          📊 Dashboard
        </li>
        <li
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "10px",
            color: "#1E293B",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          ⚙️ Settings
        </li>
        <li
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "10px",
            color: "#1E293B",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          👤 Profile
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;


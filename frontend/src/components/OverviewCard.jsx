import React from "react";

const OverviewCard = ({ title, value, icon, color, onClick }) => {
  return (
    <div
      onClick={onClick}
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
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        if (onClick) e.currentTarget.style.transform = "scale(1.03)";
      }}
      onMouseLeave={(e) => {
        if (onClick) e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: "0.5rem", color: color }}>
        {icon}
      </div>
      <h3
        style={{
          color: "#6B7280",
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 4,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: "#1E293B",
        }}
      >
        {value}
      </p>
    </div>
  );
};

export default OverviewCard;

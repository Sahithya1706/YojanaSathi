import React from "react";
import Icon from "components/AppIcon";

const stats = [
  {
    id: 1,
    label: "Total Schemes",
    value: "1,200+",
    icon: "Landmark",
    color: "var(--color-primary)",
    bg: "#EFF6FF",
  },
  {
    id: 2,
    label: "Categories",
    value: "12",
    icon: "LayoutGrid",
    color: "#7E22CE",
    bg: "#FDF4FF",
  },
  {
    id: 3,
    label: "States Covered",
    value: "36",
    icon: "MapPin",
    color: "var(--color-success)",
    bg: "#F0FDF4",
  },
  {
    id: 4,
    label: "Citizens Helped",
    value: "5.2L+",
    icon: "Users",
    color: "var(--color-accent)",
    bg: "#FFF7ED",
  },
];

const StatsBar = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats?.map((stat) => (
        <div
          key={stat?.id}
          className="rounded-xl p-4 flex items-center gap-3 transition-all duration-200 hover:shadow-md"
          style={{
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: stat?.bg }}
            aria-hidden="true"
          >
            <Icon name={stat?.icon} size={20} color={stat?.color} />
          </div>
          <div className="min-w-0">
            <p
              className="text-lg md:text-xl font-bold leading-tight"
              style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-text-primary)" }}
            >
              {stat?.value}
            </p>
            <p
              className="text-xs leading-tight"
              style={{ color: "var(--color-text-secondary)", fontFamily: "Nunito Sans, sans-serif" }}
            >
              {stat?.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
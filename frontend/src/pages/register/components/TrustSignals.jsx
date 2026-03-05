import React from "react";
import Icon from "components/AppIcon";

const trustItems = [
  {
    icon: "ShieldCheck",
    title: "Government Verified",
    description: "Certified by Ministry of Electronics & IT, Govt. of India",
    color: "#059669",
  },
  {
    icon: "Lock",
    title: "Secure Data Handling",
    description: "Your data is encrypted and never shared with third parties",
    color: "#1E40AF",
  },
  {
    icon: "FileCheck",
    title: "Privacy Protected",
    description: "Compliant with IT Act 2000 and Personal Data Protection norms",
    color: "#EA580C",
  },
  {
    icon: "Globe",
    title: "Official Portal Links",
    description: "All scheme links redirect to official government portals only",
    color: "#7C3AED",
  },
];

const TrustSignals = () => {
  return (
    <div className="space-y-3">
      <h3
        className="text-sm font-semibold uppercase tracking-wider mb-3"
        style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-text-secondary)" }}
      >
        Why Register with YojanaSathi?
      </h3>
      {trustItems?.map((item, idx) => (
        <div
          key={idx}
          className="flex items-start gap-3 p-3 rounded-xl border"
          style={{
            background: "var(--color-card)",
            borderColor: "var(--color-border)",
          }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${item?.color}18` }}
          >
            <Icon name={item?.icon} size={18} color={item?.color} />
          </div>
          <div className="min-w-0">
            <p
              className="text-sm font-semibold leading-tight"
              style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-foreground)" }}
            >
              {item?.title}
            </p>
            <p
              className="text-xs mt-0.5 leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {item?.description}
            </p>
          </div>
        </div>
      ))}
      {/* Govt badges */}
      <div
        className="mt-4 p-3 rounded-xl border"
        style={{ background: "var(--color-muted)", borderColor: "var(--color-border)" }}
      >
        <p
          className="text-xs font-semibold mb-2 text-center"
          style={{ color: "var(--color-text-secondary)", fontFamily: "Nunito Sans, sans-serif" }}
        >
          Recognized by
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {["Digital India", "MyGov", "UMANG", "NIC"]?.map((badge) => (
            <span
              key={badge}
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: "var(--color-primary)",
                color: "#fff",
                fontFamily: "Nunito Sans, sans-serif",
              }}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        {[
          { value: "2.4L+", label: "Citizens Helped" },
          { value: "500+", label: "Schemes Listed" },
          { value: "28", label: "States Covered" },
        ]?.map((stat) => (
          <div
            key={stat?.label}
            className="text-center p-2 rounded-lg"
            style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
          >
            <p
              className="text-base font-bold"
              style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-primary)" }}
            >
              {stat?.value}
            </p>
            <p
              className="text-xs leading-tight mt-0.5"
              style={{ color: "var(--color-text-secondary)", fontFamily: "Nunito Sans, sans-serif" }}
            >
              {stat?.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustSignals;
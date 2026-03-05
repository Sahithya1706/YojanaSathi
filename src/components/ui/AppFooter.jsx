import React from "react";
import { Link } from "react-router-dom";

const FOOTER_LINKS = [
  { label: "Home", to: "/" },
  { label: "Login", to: "/login" },
  { label: "Register", to: "/register" },
  { label: "Quiz", to: "/quiz" },
];

const AppFooter = ({ minimal = false }) => {
  return (
    <footer
      className={`border-t ${minimal ? "mt-8 py-4" : "mt-10 py-6"}`}
      style={{
        borderColor: "var(--color-border)",
        background: "var(--color-muted)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <p
          className="text-xs text-center"
          style={{ color: "var(--color-text-secondary)", fontFamily: "Nunito Sans, sans-serif" }}
        >
          &copy; 2026 YojanaSathi
        </p>
        <p
          className="text-xs text-center mt-1"
          style={{ color: "var(--color-text-secondary)", fontFamily: "Nunito Sans, sans-serif" }}
        >
          Built with ❤️ by PixelCoders
        </p>

        <div className="flex items-center justify-center gap-4 mt-2 flex-wrap">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-xs hover:underline"
              style={{ color: "var(--color-primary)", fontFamily: "Nunito Sans, sans-serif" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;

import React from "react";
import { Link } from "react-router-dom";
import Icon from "components/AppIcon";

const RegisterHeader = () => {
  return (
    <div className="text-center mb-6 md:mb-8">
      {/* Icon */}
      <div
        className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ background: "var(--color-primary)" }}
      >
        <Icon name="UserPlus" size={28} color="#fff" />
      </div>

      <h1
        className="text-2xl md:text-3xl font-bold mb-2"
        style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-foreground)" }}
      >
        Create Your Account
      </h1>
      <p
        className="text-sm md:text-base leading-relaxed"
        style={{ color: "var(--color-text-secondary)", fontFamily: "Source Sans Pro, sans-serif" }}
      >
        Join <span className="font-semibold" style={{ color: "var(--color-primary)" }}>YojanaSathi</span> to discover government schemes you&apos;re eligible for — free, fast, and in your language.
      </p>

      {/* Login link */}
      <p className="mt-3 text-sm" style={{ color: "var(--color-text-secondary)" }}>
        Already have an account?{" "}
        <Link
          to="/home-page"
          className="font-semibold underline"
          style={{ color: "var(--color-primary)" }}
        >
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default RegisterHeader;
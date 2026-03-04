import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "components/ui/Header";
import Icon from "components/AppIcon";
import RegistrationForm from "./components/RegistrationForm";
import TrustSignals from "./components/TrustSignals";
import RegisterHeader from "./components/RegisterHeader";

const Register = () => {
  const [lang, setLang] = useState("en");

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-background)" }}
    >
      {/* Header */}
      <Header
        isAuthenticated={false}
        user={null}
        onLogout={() => {}}
      />
      {/* Tricolor top bar offset */}
      <div className="main-content-offset" />
      {/* Page background accent */}
      <div
        className="w-full py-8 md:py-12"
        style={{
          background: "linear-gradient(135deg, #1E40AF 0%, #1E3A8A 60%, #EA580C22 100%)",
          minHeight: "180px",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center justify-center text-center pt-2 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontFamily: "Nunito Sans, sans-serif" }}
            >
              <Icon name="ShieldCheck" size={12} color="#fff" className="inline mr-1" />
              Free &amp; Secure Registration
            </span>
          </div>
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Discover Schemes Made for You
          </h2>
          <p
            className="text-sm md:text-base max-w-xl"
            style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Source Sans Pro, sans-serif" }}
          >
            Register once and get personalized government scheme recommendations based on your profile — in English, Hindi, or Marathi.
          </p>
        </div>
      </div>
      {/* Main content */}
      <main
        id="main-content"
        className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">

          {/* Form column */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl p-5 md:p-8 shadow-lg"
              style={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              {/* Form header */}
              <RegisterHeader />

              {/* Divider */}
              <div
                className="border-t mb-6"
                style={{ borderColor: "var(--color-border)" }}
                aria-hidden="true"
              />

              {/* Form */}
              <RegistrationForm />

              {/* Footer note */}
              <p
                className="text-xs text-center mt-5 leading-relaxed"
                style={{ color: "var(--color-text-secondary)", fontFamily: "Nunito Sans, sans-serif" }}
              >
                <Icon name="Lock" size={11} color="var(--color-text-secondary)" className="inline mr-1" />
                Your information is protected under the IT Act 2000. We never sell or share your personal data.
              </p>
            </div>

            {/* Back to home */}
            <div className="mt-4 text-center">
              <Link
                to="/home-page"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:underline"
                style={{ color: "var(--color-primary)", fontFamily: "Poppins, sans-serif" }}
              >
                <Icon name="ArrowLeft" size={16} color="var(--color-primary)" />
                Back to Home
              </Link>
            </div>
          </div>

          {/* Trust signals column */}
          <div className="lg:col-span-1">
            <div
              className="rounded-2xl p-5 md:p-6 sticky top-24"
              style={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <TrustSignals />
            </div>

            {/* Help card */}
            <div
              className="mt-4 rounded-2xl p-4 flex items-start gap-3"
              style={{
                background: "#EFF6FF",
                border: "1px solid #BFDBFE",
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "#1E40AF" }}
              >
                <Icon name="HelpCircle" size={18} color="#fff" />
              </div>
              <div>
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ fontFamily: "Poppins, sans-serif", color: "#1E40AF" }}
                >
                  Need Help?
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "#1E3A8A", fontFamily: "Nunito Sans, sans-serif" }}
                >
                  Call our helpline at{" "}
                  <span className="font-bold">1800-111-555</span> (Toll Free) or visit your nearest Common Service Centre (CSC) for assisted registration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer
        className="mt-10 py-6 border-t text-center"
        style={{
          borderColor: "var(--color-border)",
          background: "var(--color-muted)",
        }}
      >
        <p
          className="text-xs"
          style={{ color: "var(--color-text-secondary)", fontFamily: "Nunito Sans, sans-serif" }}
        >
          &copy; {new Date()?.getFullYear()} YojanaSathi — Government Scheme Discovery Platform &middot; Ministry of Electronics &amp; IT, Government of India
        </p>
        <div className="flex items-center justify-center gap-4 mt-2">
          {["Privacy Policy", "Terms of Use", "Accessibility", "Contact Us"]?.map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs hover:underline"
              style={{ color: "var(--color-primary)", fontFamily: "Nunito Sans, sans-serif" }}
            >
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Register;
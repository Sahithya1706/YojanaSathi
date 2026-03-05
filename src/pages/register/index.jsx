import React from "react";
import { Link } from "react-router-dom";
import Header from "components/ui/Header";
import Icon from "components/AppIcon";
import AppFooter from "components/ui/AppFooter";
import { useLanguage } from "context/LanguageContext";
import RegistrationForm from "./components/RegistrationForm";
import TrustSignals from "./components/TrustSignals";
import RegisterHeader from "./components/RegisterHeader";

const Register = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      <Header isAuthenticated={false} user={null} onLogout={() => {}} />
      <div className="main-content-offset" />

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
              {t("register.freeSecure")}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
            {t("register.title")}
          </h2>
          <p className="text-sm md:text-base max-w-xl" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Source Sans Pro, sans-serif" }}>
            {t("register.subtitle")}
          </p>
        </div>
      </div>

      <main id="main-content" className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl p-5 md:p-8 shadow-lg"
              style={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <RegisterHeader />
              <div className="border-t mb-6" style={{ borderColor: "var(--color-border)" }} aria-hidden="true" />
              <RegistrationForm />
              <p className="text-xs text-center mt-5 leading-relaxed" style={{ color: "var(--color-text-secondary)", fontFamily: "Nunito Sans, sans-serif" }}>
                <Icon name="Lock" size={11} color="var(--color-text-secondary)" className="inline mr-1" />
                {t("register.dataProtection")}
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:underline"
                style={{ color: "var(--color-primary)", fontFamily: "Poppins, sans-serif" }}
              >
                <Icon name="ArrowLeft" size={16} color="var(--color-primary)" />
                {t("register.backHome")}
              </Link>
            </div>
          </div>

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

            <div className="mt-4 rounded-2xl p-4 flex items-start gap-3" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#1E40AF" }}>
                <Icon name="HelpCircle" size={18} color="#fff" />
              </div>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ fontFamily: "Poppins, sans-serif", color: "#1E40AF" }}>
                  {t("register.needHelp")}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#1E3A8A", fontFamily: "Nunito Sans, sans-serif" }}>
                  {t("register.helpText")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
};

export default Register;


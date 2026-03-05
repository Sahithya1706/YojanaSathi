import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "components/ui/Header";
import { useLanguage } from "context/LanguageContext";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import ImpactSection from "./components/ImpactSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CTABannerSection from "./components/CTABannerSection";
import AppFooter from "components/ui/AppFooter";
import { isAdminLoggedIn, logout } from "utils/auth";

const HomePage = () => {
  const navigate = useNavigate();
  const { language: lang } = useLanguage();
  const [storedUser, setStoredUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [adminLoggedIn, setAdminLoggedIn] = useState(() => isAdminLoggedIn());

  // Mock translation function - replace with actual i18n implementation
  const t = (key) => key;

  const handleLogout = () => {
    logout();
    setStoredUser(null);
    setAdminLoggedIn(false);
    navigate("/");
  };

  const isLoggedIn = Boolean(storedUser);

  const handleStartQuiz = () => navigate(isLoggedIn ? "/quiz" : "/register");
  const handleViewSchemes = () => navigate(isLoggedIn ? "/schemes" : "/register");
  const handleCheckEligibility = () => navigate(isLoggedIn ? "/eligibility" : "/register");

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-background)" }}
    >
      <Header
        isAuthenticated={!!storedUser || adminLoggedIn}
        user={storedUser || (adminLoggedIn ? { name: "Admin", email: "admin@yojanasathi.gov" } : null)}
        onLogout={handleLogout}
      />

      <main id="main-content" className="main-content-offset">
        <HeroSection
          lang={lang}
          t={t}
          onStartQuiz={handleStartQuiz}
          onViewSchemes={handleViewSchemes}
          onCheckEligibility={handleCheckEligibility}
        />
        <FeaturesSection lang={lang} t={t} />
        <HowItWorksSection lang={lang} t={t} />
        <ImpactSection lang={lang} t={t} />
        <TestimonialsSection lang={lang} t={t} />
        <CTABannerSection lang={lang} t={t} />
        <AppFooter />
      </main>
    </div>
  );
};

export default HomePage;

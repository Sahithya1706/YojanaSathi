import React, { useState } from "react";
import Header from "components/ui/Header";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import ImpactSection from "./components/ImpactSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CTABannerSection from "./components/CTABannerSection";
import FooterSection from "./components/FooterSection";

const HomePage = () => {
  const [lang, setLang] = useState("en");

  // Get user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // Mock translation function - replace with actual i18n implementation
  const t = (key) => key;

  const handleLanguageChange = (code) => {
    setLang(code);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-background)" }}
    >
      <Header
        isAuthenticated={!!storedUser}
        user={storedUser}
        onLogout={handleLogout}
      />

      <main id="main-content" className="main-content-offset">
        <HeroSection lang={lang} t={t} />
        <FeaturesSection lang={lang} t={t} />
        <HowItWorksSection lang={lang} t={t} />
        <ImpactSection lang={lang} t={t} />
        <TestimonialsSection lang={lang} t={t} />
        <CTABannerSection lang={lang} t={t} />
        <FooterSection lang={lang} t={t} />
      </main>
    </div>
  );
};

export default HomePage;
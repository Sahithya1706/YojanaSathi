import React from "react";
import { Link } from "react-router-dom";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";

const CTABannerSection = ({ lang }) => {
  const content = {
    en: {
      heading: "Don't Miss Out on Benefits You Deserve",
      subheading: "Over ₹2 lakh crore in government benefits go unclaimed every year because citizens don't know they're eligible. Start your free quiz today.",
      cta1: "Start Free Quiz",
      cta2: "Create Account",
      note: "No registration required to take the quiz. 100% free and secure.",
    },
    hi: {
      heading: "उन लाभों को न चूकें जिनके आप हकदार हैं",
      subheading: "हर साल ₹2 लाख करोड़ से अधिक के सरकारी लाभ अनक्लेम्ड रहते हैं क्योंकि नागरिकों को पता नहीं होता। आज ही मुफ्त क्विज़ शुरू करें।",
      cta1: "मुफ्त क्विज़ शुरू करें",
      cta2: "खाता बनाएं",
      note: "क्विज़ के लिए पंजीकरण आवश्यक नहीं। 100% मुफ्त और सुरक्षित।",
    },
    mr: {
      heading: "तुम्हाला मिळणाऱ्या लाभांपासून वंचित राहू नका",
      subheading: "दरवर्षी ₹2 लाख कोटींपेक्षा जास्त सरकारी लाभ न मागितल्यामुळे राहतात. आजच मोफत क्विझ सुरू करा.",
      cta1: "मोफत क्विझ सुरू करा",
      cta2: "खाते तयार करा",
      note: "क्विझसाठी नोंदणी आवश्यक नाही. 100% मोफत आणि सुरक्षित.",
    },
  };

  const c = content?.[lang] || content?.en;

  return (
    <section
      className="py-14 md:py-18 lg:py-20 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #EA580C 0%, #C2410C 100%)" }}
      aria-label="Call to action banner"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #FFFFFF, transparent)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #FFFFFF, transparent)", transform: "translate(-30%, 30%)" }} />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
          style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }}>
          <Icon name="AlertCircle" size={14} color="#FFFFFF" />
          <span className="text-white text-xs font-medium" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
            {lang === "hi" ? "महत्वपूर्ण जानकारी" : lang === "mr" ? "महत्त्वाची माहिती" : "Important Information"}
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-5" style={{ fontFamily: "Poppins, sans-serif" }}>
          {c?.heading}
        </h2>
        <p className="text-base md:text-lg text-orange-100 mb-8 max-w-2xl mx-auto leading-relaxed">
          {c?.subheading}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-5">
          <Link to="/quiz">
            <Button
              variant="default"
              size="lg"
              iconName="ClipboardList"
              iconPosition="left"
              className="w-full sm:w-auto"
              style={{ background: "#FFFFFF", color: "#EA580C", fontWeight: 700, fontSize: "1rem" }}
            >
              {c?.cta1}
            </Button>
          </Link>
          <Link to="/register">
            <Button
              variant="outline"
              size="lg"
              iconName="UserPlus"
              iconPosition="left"
              className="w-full sm:w-auto"
              style={{ borderColor: "rgba(255,255,255,0.6)", color: "#FFFFFF", background: "rgba(255,255,255,0.1)" }}
            >
              {c?.cta2}
            </Button>
          </Link>
        </div>

        <p className="text-orange-200 text-sm flex items-center justify-center gap-2" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
          <Icon name="Lock" size={14} color="rgba(255,255,255,0.7)" />
          {c?.note}
        </p>
      </div>
    </section>
  );
};

export default CTABannerSection;

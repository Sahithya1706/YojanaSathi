import React from "react";
import { Link } from "react-router-dom";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";

const HowItWorksSection = ({ lang }) => {
  const content = {
    en: {
      heading: "How It Works",
      subheading: "Three simple steps to discover all government schemes you qualify for.",
      steps: [
        { icon: "ClipboardList", step: "01", title: "Take the Quiz", desc: "Answer 6 simple questions about your age, income, occupation, category, and state. Takes less than 2 minutes.", color: "#1E40AF" },
        { icon: "ListChecks", step: "02", title: "View Matched Schemes", desc: "Our rule-based system instantly matches you with all eligible central and state government schemes.", color: "#EA580C" },
        { icon: "ExternalLink", step: "03", title: "Apply Directly", desc: "Click on any scheme to view details, required documents, and apply directly on the official government portal.", color: "#059669" },
      ],
      cta: "Start Your Quiz Now",
    },
    hi: {
      heading: "यह कैसे काम करता है",
      subheading: "तीन सरल चरणों में सभी सरकारी योजनाएं खोजें जिनके लिए आप योग्य हैं।",
      steps: [
        { icon: "ClipboardList", step: "01", title: "क्विज़ लें", desc: "अपनी आयु, आय, व्यवसाय, श्रेणी और राज्य के बारे में 6 सरल प्रश्नों का उत्तर दें।", color: "#1E40AF" },
        { icon: "ListChecks", step: "02", title: "मिलान की गई योजनाएं देखें", desc: "हमारा सिस्टम तुरंत आपको सभी पात्र केंद्र और राज्य सरकार की योजनाओं से मिलाता है।", color: "#EA580C" },
        { icon: "ExternalLink", step: "03", title: "सीधे आवेदन करें", desc: "किसी भी योजना पर क्लिक करें, विवरण देखें और आधिकारिक पोर्टल पर सीधे आवेदन करें।", color: "#059669" },
      ],
      cta: "अभी क्विज़ शुरू करें",
    },
    mr: {
      heading: "हे कसे कार्य करते",
      subheading: "तीन सोप्या चरणांमध्ये तुम्ही पात्र असलेल्या सर्व सरकारी योजना शोधा.",
      steps: [
        { icon: "ClipboardList", step: "01", title: "क्विझ घ्या", desc: "तुमचे वय, उत्पन्न, व्यवसाय, श्रेणी आणि राज्याबद्दल 6 सोप्या प्रश्नांची उत्तरे द्या.", color: "#1E40AF" },
        { icon: "ListChecks", step: "02", title: "जुळणाऱ्या योजना पहा", desc: "आमची प्रणाली तुम्हाला त्वरित सर्व पात्र केंद्र आणि राज्य सरकारच्या योजनांशी जोडते.", color: "#EA580C" },
        { icon: "ExternalLink", step: "03", title: "थेट अर्ज करा", desc: "कोणत्याही योजनेवर क्लिक करा, तपशील पहा आणि अधिकृत पोर्टलवर थेट अर्ज करा.", color: "#059669" },
      ],
      cta: "आता क्विझ सुरू करा",
    },
  };

  const c = content?.[lang] || content?.en;

  return (
    <section
      className="py-14 md:py-18 lg:py-24"
      style={{ background: "var(--color-muted)" }}
      aria-label="How it works section"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3" style={{ color: "var(--color-text-primary)", fontFamily: "Poppins, sans-serif" }}>
            {c?.heading}
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
            {c?.subheading}
          </p>
        </div>

        <div className="relative">
          {/* Connector line - desktop only */}
          <div className="hidden lg:block absolute top-16 left-1/2 -translate-x-1/2 w-2/3 h-0.5"
            style={{ background: "linear-gradient(to right, #1E40AF, #EA580C, #059669)" }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10">
            {c?.steps?.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                {/* Step circle */}
                <div className="relative mb-5 md:mb-6">
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: step?.color }}
                  >
                    <Icon name={step?.icon} size={28} color="#FFFFFF" />
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: "#1F2937", fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {step?.step}
                  </div>
                </div>

                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3" style={{ color: "var(--color-text-primary)", fontFamily: "Poppins, sans-serif" }}>
                  {step?.title}
                </h3>
                <p className="text-sm md:text-base leading-relaxed max-w-xs" style={{ color: "var(--color-text-secondary)" }}>
                  {step?.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10 md:mt-14">
          <Link to="/register">
            <Button
              variant="default"
              size="lg"
              iconName="ArrowRight"
              iconPosition="right"
              style={{ background: "var(--color-primary)", fontSize: "1rem" }}
            >
              {c?.cta}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
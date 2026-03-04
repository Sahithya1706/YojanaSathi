import React from "react";
import { Link } from "react-router-dom";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";

const HeroSection = ({ t, lang }) => {
  const content = {
    en: {
      badge: "Government of India Verified Platform",
      title: "Discover Government Schemes",
      titleHighlight: "You\'re Eligible For",
      subtitle: "Answer 6 simple questions and instantly find all central & state government schemes tailored to your profile — in your language.",
      cta: "Start Eligibility Quiz",
      secondary: "View All Schemes",
      trust1: "1,20,000+ Citizens Helped",
      trust2: "450+ Schemes Listed",
      trust3: "Free & Secure",
    },
    hi: {
      badge: "भारत सरकार द्वारा सत्यापित प्लेटफ़ॉर्म",
      title: "सरकारी योजनाएं खोजें",
      titleHighlight: "जिनके आप पात्र हैं",
      subtitle: "6 सरल प्रश्नों का उत्तर दें और अपनी प्रोफ़ाइल के अनुसार सभी केंद्र और राज्य सरकार की योजनाएं तुरंत खोजें।",
      cta: "पात्रता क्विज़ शुरू करें",
      secondary: "सभी योजनाएं देखें",
      trust1: "1,20,000+ नागरिकों की मदद",
      trust2: "450+ योजनाएं सूचीबद्ध",
      trust3: "मुफ़्त और सुरक्षित",
    },
    mr: {
      badge: "भारत सरकारद्वारे सत्यापित व्यासपीठ",
      title: "सरकारी योजना शोधा",
      titleHighlight: "ज्यासाठी तुम्ही पात्र आहात",
      subtitle: "6 सोप्या प्रश्नांची उत्तरे द्या आणि तुमच्या प्रोफाइलनुसार सर्व केंद्र व राज्य सरकारच्या योजना त्वरित शोधा.",
      cta: "पात्रता क्विझ सुरू करा",
      secondary: "सर्व योजना पहा",
      trust1: "1,20,000+ नागरिकांना मदत",
      trust2: "450+ योजना सूचीबद्ध",
      trust3: "मोफत आणि सुरक्षित",
    },
  };

  const c = content?.[lang] || content?.en;

  return (
    <section
      className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-20 lg:pt-16 lg:pb-24"
      style={{
        background: "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 50%, #1D4ED8 100%)",
      }}
      aria-label="Hero section"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-20 -right-20 w-64 h-64 md:w-96 md:h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #EA580C, transparent)" }}
        />
        <div
          className="absolute bottom-0 -left-16 w-48 h-48 md:w-72 md:h-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #FFFFFF, transparent)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 md:mb-6"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
              <Icon name="ShieldCheck" size={14} color="#86EFAC" />
              <span className="text-xs md:text-sm font-medium text-white" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
                {c?.badge}
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-3 md:mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}>
              {c?.title}
              <br />
              <span style={{ color: "#FED7AA" }}>{c?.titleHighlight}</span>
            </h1>

            <p className="text-base md:text-lg text-blue-100 mb-7 md:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {c?.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8 md:mb-10">
              <Link to="/quiz">
                <Button
                  variant="default"
                  size="lg"
                  iconName="ClipboardList"
                  iconPosition="left"
                  className="w-full sm:w-auto"
                  style={{ background: "var(--color-accent)", border: "none", fontSize: "1rem", padding: "14px 28px" }}
                >
                  {c?.cta}
                </Button>
              </Link>
              <Link to="/home-page">                <Button
                variant="outline"
                size="lg"
                iconName="Search"
                iconPosition="left"
                className="w-full sm:w-auto"
                style={{ borderColor: "rgba(255,255,255,0.5)", color: "#FFFFFF", background: "rgba(255,255,255,0.1)" }}
              >
                {c?.secondary}
              </Button>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6">
              {[
                { icon: "Users", text: c?.trust1 },
                { icon: "BookOpen", text: c?.trust2 },
                { icon: "Lock", text: c?.trust3 },
              ]?.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Icon name={item?.icon} size={16} color="#86EFAC" />
                  <span className="text-sm text-blue-100" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
                    {item?.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual */}
          <div className="flex-shrink-0 w-full max-w-sm lg:max-w-md xl:max-w-lg">
            <div
              className="relative rounded-2xl p-6 md:p-8"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}
            >
              {/* Mock quiz card */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--color-accent)" }}>
                  <Icon name="ClipboardList" size={20} color="#FFFFFF" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                    {lang === "hi" ? "पात्रता क्विज़" : lang === "mr" ? "पात्रता क्विझ" : "Eligibility Quiz"}
                  </p>
                  <p className="text-blue-200 text-xs">{lang === "hi" ? "6 प्रश्न • 2 मिनट" : lang === "mr" ? "6 प्रश्न • 2 मिनिटे" : "6 Questions • 2 Minutes"}</p>
                </div>
              </div>

              {/* Sample question */}
              <div className="space-y-3">
                {[
                  { icon: "User", label: lang === "hi" ? "आयु" : lang === "mr" ? "वय" : "Age", value: lang === "hi" ? "45 वर्ष" : lang === "mr" ? "45 वर्षे" : "45 Years" },
                  { icon: "IndianRupee", label: lang === "hi" ? "वार्षिक आय" : lang === "mr" ? "वार्षिक उत्पन्न" : "Annual Income", value: "₹1,80,000" },
                  { icon: "Tractor", label: lang === "hi" ? "व्यवसाय" : lang === "mr" ? "व्यवसाय" : "Occupation", value: lang === "hi" ? "किसान" : lang === "mr" ? "शेतकरी" : "Farmer" },
                ]?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.12)" }}>
                    <div className="flex items-center gap-2">
                      <Icon name={item?.icon} size={16} color="#93C5FD" />
                      <span className="text-blue-200 text-sm">{item?.label}</span>
                    </div>
                    <span className="text-white text-sm font-medium">{item?.value}</span>
                  </div>
                ))}
              </div>

              {/* Result preview */}
              <div className="mt-5 p-4 rounded-xl" style={{ background: "rgba(5, 150, 105, 0.2)", border: "1px solid rgba(5,150,105,0.4)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="CheckCircle" size={18} color="#6EE7B7" />
                  <span className="text-green-300 font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                    {lang === "hi" ? "12 योजनाएं मिलीं!" : lang === "mr" ? "12 योजना सापडल्या!" : "12 Schemes Found!"}
                  </span>
                </div>
                <p className="text-green-200 text-xs">
                  {lang === "hi" ? "PM किसान, फसल बीमा, किसान क्रेडिट कार्ड..." : lang === "mr" ? "PM किसान, पीक विमा, किसान क्रेडिट कार्ड..." : "PM Kisan, Fasal Bima, Kisan Credit Card..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
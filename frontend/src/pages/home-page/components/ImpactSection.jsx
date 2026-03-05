import React, { useEffect, useRef, useState } from "react";
import Icon from "components/AppIcon";

const useCountUp = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
};

const StatCard = ({ icon, rawValue, label, suffix, start }) => {
  const count = useCountUp(rawValue, 2000, start);
  const display = rawValue >= 100000
    ? count?.toLocaleString("en-IN")
    : count?.toLocaleString("en-IN");

  return (
    <div
      className="flex flex-col items-center text-center p-6 md:p-8 rounded-2xl"
      style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
    >
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-4"
        style={{ background: "rgba(255,255,255,0.15)" }}>
        <Icon name={icon} size={28} color="#FFFFFF" />
      </div>
      <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
        {display}{suffix}
      </div>
      <p className="text-blue-200 text-sm md:text-base" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
        {label}
      </p>
    </div>
  );
};

const ImpactSection = ({ lang }) => {
  const [started, setStarted] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (sectionRef?.current) observer?.observe(sectionRef?.current);
    return () => observer?.disconnect();
  }, []);

  const content = {
    en: {
      heading: "Trusted by Lakhs of Citizens",
      subheading: "Real impact across India — helping citizens access their rightful government benefits.",
      stats: [
        { icon: "Users", rawValue: 120000, suffix: "+", label: "Citizens Helped" },
        { icon: "BookOpen", rawValue: 450, suffix: "+", label: "Schemes Listed" },
        { icon: "MapPin", rawValue: 28, suffix: "", label: "States Covered" },
        { icon: "CheckCircle", rawValue: 95000, suffix: "+", label: "Successful Applications" },
      ],
      categories: [
        { icon: "GraduationCap", label: "Education & Scholarship", count: "85+" },
        { icon: "HeartPulse", label: "Health & Insurance", count: "60+" },
        { icon: "Tractor", label: "Agriculture & Farming", count: "75+" },
        { icon: "Home", label: "Housing & Shelter", count: "45+" },
        { icon: "Briefcase", label: "Employment & Skills", count: "90+" },
        { icon: "Baby", label: "Women & Child Welfare", count: "95+" },
      ],
      catHeading: "Schemes Across All Categories",
    },
    hi: {
      heading: "लाखों नागरिकों का विश्वास",
      subheading: "पूरे भारत में वास्तविक प्रभाव — नागरिकों को उनके सरकारी लाभ तक पहुंचने में मदद।",
      stats: [
        { icon: "Users", rawValue: 120000, suffix: "+", label: "नागरिकों की मदद" },
        { icon: "BookOpen", rawValue: 450, suffix: "+", label: "योजनाएं सूचीबद्ध" },
        { icon: "MapPin", rawValue: 28, suffix: "", label: "राज्य कवर" },
        { icon: "CheckCircle", rawValue: 95000, suffix: "+", label: "सफल आवेदन" },
      ],
      categories: [
        { icon: "GraduationCap", label: "शिक्षा और छात्रवृत्ति", count: "85+" },
        { icon: "HeartPulse", label: "स्वास्थ्य और बीमा", count: "60+" },
        { icon: "Tractor", label: "कृषि और खेती", count: "75+" },
        { icon: "Home", label: "आवास और आश्रय", count: "45+" },
        { icon: "Briefcase", label: "रोजगार और कौशल", count: "90+" },
        { icon: "Baby", label: "महिला और बाल कल्याण", count: "95+" },
      ],
      catHeading: "सभी श्रेणियों में योजनाएं",
    },
    mr: {
      heading: "लाखो नागरिकांचा विश्वास",
      subheading: "संपूर्ण भारतात वास्तविक प्रभाव — नागरिकांना त्यांचे सरकारी लाभ मिळवण्यास मदत.",
      stats: [
        { icon: "Users", rawValue: 120000, suffix: "+", label: "नागरिकांना मदत" },
        { icon: "BookOpen", rawValue: 450, suffix: "+", label: "योजना सूचीबद्ध" },
        { icon: "MapPin", rawValue: 28, suffix: "", label: "राज्ये समाविष्ट" },
        { icon: "CheckCircle", rawValue: 95000, suffix: "+", label: "यशस्वी अर्ज" },
      ],
      categories: [
        { icon: "GraduationCap", label: "शिक्षण आणि शिष्यवृत्ती", count: "85+" },
        { icon: "HeartPulse", label: "आरोग्य आणि विमा", count: "60+" },
        { icon: "Tractor", label: "शेती आणि कृषी", count: "75+" },
        { icon: "Home", label: "गृहनिर्माण आणि निवारा", count: "45+" },
        { icon: "Briefcase", label: "रोजगार आणि कौशल्य", count: "90+" },
        { icon: "Baby", label: "महिला आणि बाल कल्याण", count: "95+" },
      ],
      catHeading: "सर्व श्रेणींमध्ये योजना",
    },
  };

  const c = content?.[lang] || content?.en;

  return (
    <section
      ref={sectionRef}
      className="py-14 md:py-18 lg:py-24"
      style={{ background: "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)" }}
      aria-label="Impact statistics section"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
            {c?.heading}
          </h2>
          <p className="text-base md:text-lg text-blue-200 max-w-2xl mx-auto">
            {c?.subheading}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
          {c?.stats?.map((stat, i) => (
            <StatCard key={i} {...stat} start={started} />
          ))}
        </div>

        {/* Category grid */}
        <div className="text-center mb-6 md:mb-8">
          <h3 className="text-xl md:text-2xl font-semibold text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
            {c?.catHeading}
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {c?.categories?.map((cat, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-4 rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-1"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <Icon name={cat?.icon} size={24} color="#FED7AA" />
              <span className="text-white font-bold text-lg mt-2" style={{ fontFamily: "Poppins, sans-serif" }}>{cat?.count}</span>
              <span className="text-blue-200 text-xs mt-1 leading-tight" style={{ fontFamily: "Nunito Sans, sans-serif" }}>{cat?.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;

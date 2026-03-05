import React from "react";
import { Link } from "react-router-dom";
import Icon from "components/AppIcon";

const FooterSection = ({ lang }) => {
  const currentYear = new Date()?.getFullYear();

  const content = {
    en: {
      tagline: "Helping every Indian citizen access government benefits they deserve.",
      quickLinks: "Quick Links",
      links: [
        { label: "Home", path: "/" },
        { label: "Start Quiz", path: "/quiz" },
        { label: "Register", path: "/register" },
        { label: "Login", path: "/login" },
        { label: "Dashboard", path: "/dashboard" },
      ],
      categories: "Scheme Categories",
      cats: ["Education & Scholarship", "Health & Insurance", "Agriculture", "Housing", "Employment", "Women & Child"],
      contact: "Contact & Support",
      disclaimer: "This is a citizen-assistance platform. All scheme information is sourced from official government portals. YojanaSathi is not affiliated with any government body.",
      copyright: `© ${currentYear} YojanaSathi. All rights reserved.`,
      govtNote: "Government of India Initiative",
    },
    hi: {
      tagline: "हर भारतीय नागरिक को उनके हक के सरकारी लाभ तक पहुंचाने में मदद।",
      quickLinks: "त्वरित लिंक",
      links: [
        { label: "होम", path: "/" },
        { label: "क्विज़ शुरू करें", path: "/quiz" },
        { label: "पंजीकरण", path: "/register" },
        { label: "लॉगिन", path: "/login" },
        { label: "डैशबोर्ड", path: "/dashboard" },
      ],
      categories: "योजना श्रेणियां",
      cats: ["शिक्षा और छात्रवृत्ति", "स्वास्थ्य और बीमा", "कृषि", "आवास", "रोजगार", "महिला और बाल"],
      contact: "संपर्क और सहायता",
      disclaimer: "यह एक नागरिक-सहायता प्लेटफ़ॉर्म है। सभी योजना जानकारी आधिकारिक सरकारी पोर्टल से ली गई है।",
      copyright: `© ${currentYear} सेवासेतु। सर्वाधिकार सुरक्षित।`,
      govtNote: "भारत सरकार की पहल",
    },
    mr: {
      tagline: "प्रत्येक भारतीय नागरिकाला त्यांच्या हक्काचे सरकारी लाभ मिळवण्यास मदत.",
      quickLinks: "त्वरित दुवे",
      links: [
        { label: "मुख्यपृष्ठ", path: "/" },
        { label: "क्विझ सुरू करा", path: "/quiz" },
        { label: "नोंदणी", path: "/register" },
        { label: "लॉगिन", path: "/login" },
        { label: "डॅशबोर्ड", path: "/dashboard" },
      ],
      categories: "योजना श्रेणी",
      cats: ["शिक्षण आणि शिष्यवृत्ती", "आरोग्य आणि विमा", "शेती", "गृहनिर्माण", "रोजगार", "महिला आणि बाल"],
      contact: "संपर्क आणि समर्थन",
      disclaimer: "हे एक नागरिक-सहाय्य व्यासपीठ आहे. सर्व योजना माहिती अधिकृत सरकारी पोर्टलवरून घेतली आहे.",
      copyright: `© ${currentYear} सेवासेतु. सर्व हक्क राखीव.`,
      govtNote: "भारत सरकारचा उपक्रम",
    },
  };

  const c = content?.[lang] || content?.en;

  return (
    <footer style={{ background: "#0F172A" }} aria-label="Footer">
      {/* Tricolor bar */}
      <div className="h-1" style={{ background: "linear-gradient(to right, #FF9933 33.33%, #FFFFFF 33.33% 66.66%, #138808 66.66%)" }} aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--color-primary)" }}>
                <Icon name="Landmark" size={22} color="#FFFFFF" />
              </div>
              <div>
                <p className="text-white font-bold text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>YojanaSathi</p>
                <p className="text-xs" style={{ color: "#94A3B8" }}>Government Scheme Discovery</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#94A3B8" }}>{c?.tagline}</p>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg inline-flex"
              style={{ background: "rgba(30,64,175,0.3)", border: "1px solid rgba(59,130,246,0.3)" }}>
              <Icon name="ShieldCheck" size={14} color="#60A5FA" />
              <span className="text-xs text-blue-300" style={{ fontFamily: "Nunito Sans, sans-serif" }}>{c?.govtNote}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>{c?.quickLinks}</h4>
            <ul className="space-y-2">
              {c?.links?.map((link, i) => (
                <li key={i}>
                  <Link to={link?.path} className="text-sm transition-colors hover:text-blue-400"
                    style={{ color: "#94A3B8" }}>
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>{c?.categories}</h4>
            <ul className="space-y-2">
              {c?.cats?.map((cat, i) => (
                <li key={i} className="text-sm" style={{ color: "#94A3B8" }}>{cat}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>{c?.contact}</h4>
            <div className="space-y-3">
              {[
                { icon: "Mail", text: "help@yojanasathi.gov.in" },
                { icon: "Phone", text: "1800-XXX-XXXX (Toll Free)" },
                { icon: "Clock", text: "Mon–Sat, 9 AM – 6 PM" },
              ]?.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Icon name={item?.icon} size={14} color="#60A5FA" />
                  <span className="text-sm" style={{ color: "#94A3B8" }}>{item?.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t pt-6 mb-4" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <p className="text-xs leading-relaxed text-center" style={{ color: "#64748B" }}>{c?.disclaimer}</p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "#64748B" }}>{c?.copyright}</p>
          <div className="flex items-center gap-4">
            {["Privacy Policy", "Terms of Use", "Accessibility"]?.map((item, i) => (
              <span key={i} className="text-xs cursor-pointer hover:text-blue-400 transition-colors" style={{ color: "#64748B" }}>
                {item}
              </span>
            ))}
          </div>
        </div>
        <p className="text-xs text-center mt-4" style={{ color: "#64748B" }}>
          Built with ❤️ by PixelCoders
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;

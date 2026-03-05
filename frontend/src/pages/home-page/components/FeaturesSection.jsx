import React from "react";
import Icon from "components/AppIcon";

const FeaturesSection = ({ lang }) => {
  const content = {
    en: {
      heading: "Why Choose YojanaSathi?",
      subheading: "Designed for every Indian citizen — simple, secure, and in your language.",
      features: [
        { icon: "Languages", title: "Multilingual Support", desc: "Available in English, Hindi, and Marathi. Switch languages instantly for a comfortable experience.", color: "#1E40AF" },
        { icon: "Zap", title: "Instant Results", desc: "Get matched schemes in under 2 minutes. No paperwork, no waiting, no middlemen required.", color: "#EA580C" },
        { icon: "ShieldCheck", title: "Government Verified", desc: "All schemes are sourced directly from official government portals with verified information.", color: "#059669" },
        { icon: "BookmarkCheck", title: "Save & Track", desc: "Bookmark schemes you\'re interested in and track your applications from your personal dashboard.", color: "#7C3AED" },
        { icon: "FileText", title: "Document Checklist", desc: "Know exactly which documents you need before visiting any government office or portal.", color: "#D97706" },
        { icon: "ExternalLink", title: "Direct Apply Links", desc: "One-click redirect to official government portals to apply directly without any intermediary.", color: "#0891B2" },
      ],
    },
    hi: {
      heading: "सेवासेतु क्यों चुनें?",
      subheading: "हर भारतीय नागरिक के लिए — सरल, सुरक्षित और आपकी भाषा में।",
      features: [
        { icon: "Languages", title: "बहुभाषी समर्थन", desc: "अंग्रेजी, हिंदी और मराठी में उपलब्ध। आरामदायक अनुभव के लिए तुरंत भाषा बदलें।", color: "#1E40AF" },
        { icon: "Zap", title: "तत्काल परिणाम", desc: "2 मिनट से कम में मिलान की गई योजनाएं प्राप्त करें। कोई कागजी कार्रवाई नहीं।", color: "#EA580C" },
        { icon: "ShieldCheck", title: "सरकार द्वारा सत्यापित", desc: "सभी योजनाएं आधिकारिक सरकारी पोर्टल से सत्यापित जानकारी के साथ हैं।", color: "#059669" },
        { icon: "BookmarkCheck", title: "सहेजें और ट्रैक करें", desc: "रुचि की योजनाओं को बुकमार्क करें और अपने डैशबोर्ड से आवेदन ट्रैक करें।", color: "#7C3AED" },
        { icon: "FileText", title: "दस्तावेज़ सूची", desc: "किसी भी सरकारी कार्यालय जाने से पहले जानें कि आपको कौन से दस्तावेज़ चाहिए।", color: "#D97706" },
        { icon: "ExternalLink", title: "सीधे आवेदन लिंक", desc: "बिना किसी बिचौलिए के सीधे आवेदन करने के लिए आधिकारिक पोर्टल पर जाएं।", color: "#0891B2" },
      ],
    },
    mr: {
      heading: "सेवासेतु का निवडावे?",
      subheading: "प्रत्येक भारतीय नागरिकासाठी — सोपे, सुरक्षित आणि तुमच्या भाषेत.",
      features: [
        { icon: "Languages", title: "बहुभाषिक समर्थन", desc: "इंग्रजी, हिंदी आणि मराठीत उपलब्ध. आरामदायक अनुभवासाठी भाषा त्वरित बदला.", color: "#1E40AF" },
        { icon: "Zap", title: "त्वरित निकाल", desc: "2 मिनिटांपेक्षा कमी वेळात जुळणाऱ्या योजना मिळवा. कोणतेही कागदपत्र नाही.", color: "#EA580C" },
        { icon: "ShieldCheck", title: "सरकारद्वारे सत्यापित", desc: "सर्व योजना अधिकृत सरकारी पोर्टलवरून सत्यापित माहितीसह आहेत.", color: "#059669" },
        { icon: "BookmarkCheck", title: "जतन करा आणि ट्रॅक करा", desc: "स्वारस्य असलेल्या योजना बुकमार्क करा आणि डॅशबोर्डवरून अर्ज ट्रॅक करा.", color: "#7C3AED" },
        { icon: "FileText", title: "कागदपत्र यादी", desc: "कोणत्याही सरकारी कार्यालयात जाण्यापूर्वी कोणती कागदपत्रे लागतात ते जाणून घ्या.", color: "#D97706" },
        { icon: "ExternalLink", title: "थेट अर्ज लिंक", desc: "कोणत्याही मध्यस्थाशिवाय थेट अर्ज करण्यासाठी अधिकृत पोर्टलवर जा.", color: "#0891B2" },
      ],
    },
  };

  const c = content?.[lang] || content?.en;

  return (
    <section className="py-14 md:py-18 lg:py-24" style={{ background: "var(--color-background)" }} aria-label="Features section">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3" style={{ color: "var(--color-text-primary)", fontFamily: "Poppins, sans-serif" }}>
            {c?.heading}
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
            {c?.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          {c?.features?.map((feature, i) => (
            <div
              key={i}
              className="group p-5 md:p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "var(--color-card)",
                borderColor: "var(--color-border)",
                boxShadow: "var(--shadow-sm)",
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "var(--shadow-sm)"}
            >
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${feature?.color}18` }}
              >
                <Icon name={feature?.icon} size={24} color={feature?.color} />
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-2" style={{ color: "var(--color-text-primary)", fontFamily: "Poppins, sans-serif" }}>
                {feature?.title}
              </h3>
              <p className="text-sm md:text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                {feature?.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
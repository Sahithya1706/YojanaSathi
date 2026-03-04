import React from "react";
import Image from "components/AppImage";
import Icon from "components/AppIcon";

const TestimonialsSection = ({ lang }) => {
  const content = {
    en: {
      heading: "Stories from Real Citizens",
      subheading: "Thousands of Indians have discovered and applied for schemes they never knew existed.",
      testimonials: [
      {
        name: "Ramesh Yadav",
        location: "Varanasi, Uttar Pradesh",
        role: "Farmer",
        avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_178fd24ab-1763293417052.png",
        avatarAlt: "Middle-aged Indian farmer man with weathered face and warm smile wearing traditional kurta in rural setting",
        quote: "I found PM Kisan and Fasal Bima Yojana through YojanaSathi. I was getting ₹6,000 per year that I didn't even know I was eligible for!",
        scheme: "PM Kisan Samman Nidhi",
        benefit: "₹6,000/year",
        stars: 5
      },
      {
        name: "Sunita Devi",
        location: "Patna, Bihar",
        role: "Homemaker",
        avatar: "https://images.unsplash.com/photo-1726431531765-7e44461757a9",
        avatarAlt: "Indian woman in colorful saree with gentle expression standing in front of traditional home",
        quote: "The quiz took only 2 minutes and showed me 8 schemes for women. I applied for Ujjwala Yojana and got a free LPG connection within a month.",
        scheme: "PM Ujjwala Yojana",
        benefit: "Free LPG Connection",
        stars: 5
      },
      {
        name: "Arjun Meena",
        location: "Jaipur, Rajasthan",
        role: "Student",
        avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_17a1f455f-1763296936452.png",
        avatarAlt: "Young Indian male student with confident smile wearing casual shirt in university campus environment",
        quote: "As an SC student, I found 5 scholarship schemes I qualified for. The document checklist saved me multiple trips to the government office.",
        scheme: "National Scholarship Portal",
        benefit: "₹25,000 Scholarship",
        stars: 5
      }]

    },
    hi: {
      heading: "वास्तविक नागरिकों की कहानियां",
      subheading: "हजारों भारतीयों ने उन योजनाओं की खोज की जिनके बारे में उन्हें पता नहीं था।",
      testimonials: [
      {
        name: "रमेश यादव",
        location: "वाराणसी, उत्तर प्रदेश",
        role: "किसान",
        avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_178fd24ab-1763293417052.png",
        avatarAlt: "Middle-aged Indian farmer man with weathered face and warm smile wearing traditional kurta in rural setting",
        quote: "मुझे सेवासेतु के माध्यम से PM किसान और फसल बीमा योजना मिली। मुझे ₹6,000 प्रति वर्ष मिल रहे थे जिसके बारे में मुझे पता नहीं था!",
        scheme: "PM किसान सम्मान निधि",
        benefit: "₹6,000/वर्ष",
        stars: 5
      },
      {
        name: "सुनीता देवी",
        location: "पटना, बिहार",
        role: "गृहिणी",
        avatar: "https://images.unsplash.com/photo-1726431531765-7e44461757a9",
        avatarAlt: "Indian woman in colorful saree with gentle expression standing in front of traditional home",
        quote: "क्विज़ में केवल 2 मिनट लगे और महिलाओं के लिए 8 योजनाएं दिखाईं। मैंने उज्ज्वला योजना के लिए आवेदन किया और एक महीने में मुफ्त LPG कनेक्शन मिला।",
        scheme: "PM उज्ज्वला योजना",
        benefit: "मुफ्त LPG कनेक्शन",
        stars: 5
      },
      {
        name: "अर्जुन मीणा",
        location: "जयपुर, राजस्थान",
        role: "छात्र",
        avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_17a1f455f-1763296936452.png",
        avatarAlt: "Young Indian male student with confident smile wearing casual shirt in university campus environment",
        quote: "SC छात्र के रूप में, मुझे 5 छात्रवृत्ति योजनाएं मिलीं। दस्तावेज़ सूची ने मुझे सरकारी कार्यालय के कई चक्कर बचाए।",
        scheme: "राष्ट्रीय छात्रवृत्ति पोर्टल",
        benefit: "₹25,000 छात्रवृत्ति",
        stars: 5
      }]

    },
    mr: {
      heading: "वास्तविक नागरिकांच्या कथा",
      subheading: "हजारो भारतीयांनी त्यांना माहीत नसलेल्या योजना शोधल्या आणि अर्ज केले.",
      testimonials: [
      {
        name: "रमेश यादव",
        location: "वाराणसी, उत्तर प्रदेश",
        role: "शेतकरी",
        avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_178fd24ab-1763293417052.png",
        avatarAlt: "Middle-aged Indian farmer man with weathered face and warm smile wearing traditional kurta in rural setting",
        quote: "मला सेवासेतुद्वारे PM किसान आणि फसल विमा योजना सापडली. मला दरवर्षी ₹6,000 मिळत होते जे मला माहीत नव्हते!",
        scheme: "PM किसान सन्मान निधी",
        benefit: "₹6,000/वर्ष",
        stars: 5
      },
      {
        name: "सुनीता देवी",
        location: "पटना, बिहार",
        role: "गृहिणी",
        avatar: "https://images.unsplash.com/photo-1726431531765-7e44461757a9",
        avatarAlt: "Indian woman in colorful saree with gentle expression standing in front of traditional home",
        quote: "क्विझला फक्त 2 मिनिटे लागली आणि महिलांसाठी 8 योजना दाखवल्या. मी उज्ज्वला योजनेसाठी अर्ज केला आणि एका महिन्यात मोफत LPG कनेक्शन मिळाले.",
        scheme: "PM उज्ज्वला योजना",
        benefit: "मोफत LPG कनेक्शन",
        stars: 5
      },
      {
        name: "अर्जुन मीणा",
        location: "जयपूर, राजस्थान",
        role: "विद्यार्थी",
        avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_17a1f455f-1763296936452.png",
        avatarAlt: "Young Indian male student with confident smile wearing casual shirt in university campus environment",
        quote: "SC विद्यार्थी म्हणून, मला 5 शिष्यवृत्ती योजना सापडल्या. कागदपत्र यादीमुळे सरकारी कार्यालयाच्या अनेक फेऱ्या वाचल्या.",
        scheme: "राष्ट्रीय शिष्यवृत्ती पोर्टल",
        benefit: "₹25,000 शिष्यवृत्ती",
        stars: 5
      }]

    }
  };

  const c = content?.[lang] || content?.en;

  return (
    <section className="py-14 md:py-18 lg:py-24" style={{ background: "var(--color-background)" }} aria-label="Testimonials section">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3" style={{ color: "var(--color-text-primary)", fontFamily: "Poppins, sans-serif" }}>
            {c?.heading}
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
            {c?.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {c?.testimonials?.map((t, i) =>
          <div
            key={i}
            className="p-6 rounded-2xl flex flex-col"
            style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-sm)" }}>
            
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t?.stars })?.map((_, s) =>
              <Icon key={s} name="Star" size={16} color="#F59E0B" />
              )}
              </div>

              {/* Quote */}
              <p className="text-sm md:text-base leading-relaxed mb-5 flex-1" style={{ color: "var(--color-text-primary)" }}>
                &ldquo;{t?.quote}&rdquo;
              </p>

              {/* Scheme badge */}
              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg"
            style={{ background: "rgba(30,64,175,0.08)" }}>
                <Icon name="CheckCircle" size={14} color="var(--color-primary)" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "var(--color-primary)" }}>{t?.scheme}</p>
                  <p className="text-xs" style={{ color: "var(--color-success)" }}>{t?.benefit}</p>
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                  src={t?.avatar}
                  alt={t?.avatarAlt}
                  className="w-full h-full object-cover" />
                
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: "var(--color-text-primary)", fontFamily: "Poppins, sans-serif" }}>{t?.name}</p>
                  <p className="text-xs truncate" style={{ color: "var(--color-text-secondary)" }}>{t?.role} · {t?.location}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

};

export default TestimonialsSection;
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "appLanguage";
const SUPPORTED_LANGUAGES = ["en", "hi", "mr"];

const translations = {
  en: {
    "header.home": "Home",
    "header.startQuiz": "Start Quiz",
    "header.dashboard": "My Dashboard",
    "header.login": "Login",
    "header.register": "Register",
    "header.govtVerified": "Govt. Verified",
    "header.account": "My Account",
    "header.savedSchemes": "Saved Schemes",
    "header.profileSettings": "Profile Settings",
    "header.signOut": "Sign Out",
    "header.loginToAccount": "Login to Account",
    "header.createAccount": "Create Free Account",
    "header.quiz": "Quiz",
    "header.startEligibilityQuiz": "Start eligibility quiz",
    "header.skipToMain": "Skip to main content",
    "header.govtPlatform": "Government Verified Platform",

    "login.title": "Login to YojanaSathi",
    "login.subtitle": "Access your personalized scheme dashboard",
    "login.email": "Email Address",
    "login.password": "Password",
    "login.submit": "Login",
    "login.noAccount": "Don't have an account?",
    "login.registerLink": "Register",
    "login.invalidCredentials": "Invalid email or password.",
    "login.emailPlaceholder": "Enter your email",
    "login.passwordPlaceholder": "Enter password",

    "register.alreadyAccount": "Already have an account?",
    "register.loginLink": "Login",
    "register.freeSecure": "Free & Secure Registration",
    "register.title": "Discover Schemes Made for You",
    "register.subtitle": "Register once and get personalized government scheme recommendations based on your profile.",
    "register.dataProtection": "Your information is protected under the IT Act 2000. We never sell or share your personal data.",
    "register.backHome": "Back to Home",
    "register.needHelp": "Need Help?",
    "register.helpText": "Call our helpline at 1800-111-555 (Toll Free) or visit your nearest Common Service Centre (CSC) for assisted registration.",

    "home.startEligibilityQuiz": "Start Eligibility Quiz",

    "dashboard.savedSchemes": "Saved Schemes",
    "dashboard.quizHistory": "Quiz History",
    "dashboard.myProfile": "My Profile",
    "dashboard.signOut": "Sign Out",
    "dashboard.discoverMore": "Discover More",
    "dashboard.newQuiz": "New Quiz",
    "dashboard.updateProfileHint": "Update your profile for better matches",
    "dashboard.updateProfileDesc": "Accurate demographic details help us find more relevant schemes for you.",
    "dashboard.updateProfile": "Update Profile",
    "dashboard.confirmSignOut": "Are you sure you want to sign out?",
    "dashboard.cancel": "Cancel",

    "quiz.question": "Question",
    "quiz.of": "of",
    "quiz.eligibleTitle": "Schemes You Are Eligible For",
    "quiz.goDashboard": "Go To Dashboard",
    "quiz.title": "Eligibility Quiz",
    "quiz.result": "Quiz Result",
    "quiz.userSummary": "User Answers Summary",
    "quiz.aiRecommended": "AI Recommended Schemes",

    "admin.loginTitle": "Admin Panel Login",
    "admin.emailPlaceholder": "Admin Email",
    "admin.passwordPlaceholder": "Password",
    "admin.login": "Login",
    "admin.invalidCredentials": "Invalid admin credentials",
    "admin.dashboardTitle": "YojanaSathi Admin Dashboard",
    "admin.logout": "Logout",
    "admin.manageSchemes": "Manage Schemes",
    "admin.manageSchemesDesc": "Add or remove government schemes",
    "admin.viewUsers": "View Users",
    "admin.viewUsersDesc": "See registered platform users",
    "admin.analytics": "Analytics",
    "admin.comingSoon": "Coming Soon",
    "admin.registeredUsers": "Registered Users",
    "admin.noUsers": "No users registered yet",
    "admin.action": "Action",
    "admin.delete": "Delete",
    "admin.deleteUserConfirm": "Delete this user?",
    "admin.manageGovSchemes": "Manage Government Schemes",
    "admin.addNewScheme": "Add new scheme",
    "admin.add": "Add",
    "admin.platformAnalytics": "Platform Analytics",
  },
  hi: {
    "header.home": "होम",
    "header.startQuiz": "क्विज़ शुरू करें",
    "header.dashboard": "मेरा डैशबोर्ड",
    "header.login": "लॉगिन",
    "header.register": "रजिस्टर",
    "header.govtVerified": "सरकारी सत्यापित",
    "header.account": "मेरा खाता",
    "header.savedSchemes": "सहेजी गई योजनाएं",
    "header.profileSettings": "प्रोफाइल सेटिंग्स",
    "header.signOut": "साइन आउट",
    "header.loginToAccount": "खाते में लॉगिन करें",
    "header.createAccount": "मुफ्त खाता बनाएं",
    "header.quiz": "क्विज़",
    "header.startEligibilityQuiz": "पात्रता क्विज़ शुरू करें",
    "header.skipToMain": "मुख्य सामग्री पर जाएं",
    "header.govtPlatform": "सरकारी सत्यापित प्लेटफॉर्म",

    "login.title": "YojanaSathi में लॉगिन करें",
    "login.subtitle": "अपना व्यक्तिगत योजना डैशबोर्ड देखें",
    "login.email": "ईमेल पता",
    "login.password": "पासवर्ड",
    "login.submit": "लॉगिन",
    "login.noAccount": "खाता नहीं है?",
    "login.registerLink": "रजिस्टर",
    "login.invalidCredentials": "अमान्य ईमेल या पासवर्ड।",
    "login.emailPlaceholder": "अपना ईमेल दर्ज करें",
    "login.passwordPlaceholder": "पासवर्ड दर्ज करें",

    "register.alreadyAccount": "पहले से खाता है?",
    "register.loginLink": "लॉगिन",
    "register.freeSecure": "मुफ्त और सुरक्षित पंजीकरण",
    "register.title": "अपने लिए योजनाएं खोजें",
    "register.subtitle": "एक बार पंजीकरण करें और अपनी प्रोफाइल के आधार पर व्यक्तिगत सरकारी योजना सुझाव पाएं।",
    "register.dataProtection": "आपकी जानकारी आईटी एक्ट 2000 के तहत सुरक्षित है। हम आपका डेटा साझा या बेचते नहीं हैं।",
    "register.backHome": "होम पर वापस जाएं",
    "register.needHelp": "मदद चाहिए?",
    "register.helpText": "हमारी हेल्पलाइन 1800-111-555 (टोल फ्री) पर कॉल करें या CSC केंद्र पर जाएं।",

    "home.startEligibilityQuiz": "पात्रता क्विज़ शुरू करें",

    "dashboard.savedSchemes": "सहेजी गई योजनाएं",
    "dashboard.quizHistory": "क्विज़ इतिहास",
    "dashboard.myProfile": "मेरी प्रोफाइल",
    "dashboard.signOut": "साइन आउट",
    "dashboard.discoverMore": "और खोजें",
    "dashboard.newQuiz": "नई क्विज़",
    "dashboard.updateProfileHint": "बेहतर मैच के लिए प्रोफाइल अपडेट करें",
    "dashboard.updateProfileDesc": "सही जानकारी से अधिक उपयुक्त योजनाएं मिलती हैं।",
    "dashboard.updateProfile": "प्रोफाइल अपडेट करें",
    "dashboard.confirmSignOut": "क्या आप साइन आउट करना चाहते हैं?",
    "dashboard.cancel": "रद्द करें",

    "quiz.question": "प्रश्न",
    "quiz.of": "में से",
    "quiz.eligibleTitle": "आपके लिए पात्र योजनाएं",
    "quiz.goDashboard": "डैशबोर्ड पर जाएं",

    "admin.loginTitle": "एडमिन पैनल लॉगिन",
    "admin.emailPlaceholder": "एडमिन ईमेल",
    "admin.passwordPlaceholder": "पासवर्ड",
    "admin.login": "लॉगिन",
    "admin.invalidCredentials": "अमान्य एडमिन क्रेडेंशियल",
    "admin.dashboardTitle": "YojanaSathi एडमिन डैशबोर्ड",
    "admin.logout": "लॉगआउट",
    "admin.manageSchemes": "योजनाएं प्रबंधित करें",
    "admin.manageSchemesDesc": "सरकारी योजनाएं जोड़ें या हटाएं",
    "admin.viewUsers": "उपयोगकर्ता देखें",
    "admin.viewUsersDesc": "पंजीकृत उपयोगकर्ता देखें",
    "admin.analytics": "विश्लेषण",
    "admin.comingSoon": "जल्द आ रहा है",
    "admin.registeredUsers": "पंजीकृत उपयोगकर्ता",
    "admin.noUsers": "अभी कोई उपयोगकर्ता पंजीकृत नहीं है",
    "admin.action": "कार्रवाई",
    "admin.delete": "हटाएं",
    "admin.deleteUserConfirm": "क्या इस उपयोगकर्ता को हटाएं?",
    "admin.manageGovSchemes": "सरकारी योजनाएं प्रबंधित करें",
    "admin.addNewScheme": "नई योजना जोड़ें",
    "admin.add": "जोड़ें",
    "admin.platformAnalytics": "प्लेटफॉर्म विश्लेषण",
  },
  mr: {
    "header.home": "मुख्यपृष्ठ",
    "header.startQuiz": "क्विझ सुरू करा",
    "header.dashboard": "माझा डॅशबोर्ड",
    "header.login": "लॉगिन",
    "header.register": "नोंदणी",
    "header.govtVerified": "सरकारी प्रमाणित",
    "header.account": "माझे खाते",
    "header.savedSchemes": "जतन योजना",
    "header.profileSettings": "प्रोफाइल सेटिंग्ज",
    "header.signOut": "साइन आउट",
    "header.loginToAccount": "खात्यात लॉगिन",
    "header.createAccount": "मोफत खाते तयार करा",
    "header.quiz": "क्विझ",
    "header.startEligibilityQuiz": "पात्रता क्विझ सुरू करा",
    "header.skipToMain": "मुख्य मजकूराकडे जा",
    "header.govtPlatform": "सरकारी प्रमाणित प्लॅटफॉर्म",

    "login.title": "YojanaSathi मध्ये लॉगिन करा",
    "login.subtitle": "तुमचा वैयक्तिक योजना डॅशबोर्ड पाहा",
    "login.email": "ईमेल पत्ता",
    "login.password": "पासवर्ड",
    "login.submit": "लॉगिन",
    "login.noAccount": "खाते नाही?",
    "login.registerLink": "नोंदणी",
    "login.invalidCredentials": "अवैध ईमेल किंवा पासवर्ड.",
    "login.emailPlaceholder": "तुमचा ईमेल भरा",
    "login.passwordPlaceholder": "पासवर्ड भरा",

    "register.alreadyAccount": "आधीच खाते आहे?",
    "register.loginLink": "लॉगिन",
    "register.freeSecure": "मोफत आणि सुरक्षित नोंदणी",
    "register.title": "तुमच्यासाठी योजना शोधा",
    "register.subtitle": "एकदाच नोंदणी करा आणि तुमच्या प्रोफाइलनुसार वैयक्तिक योजना शिफारसी मिळवा.",
    "register.dataProtection": "तुमची माहिती IT Act 2000 अंतर्गत सुरक्षित आहे. आम्ही तुमचा डेटा विकत किंवा शेअर करत नाही.",
    "register.backHome": "मुख्यपृष्ठावर जा",
    "register.needHelp": "मदत हवी आहे?",
    "register.helpText": "आमच्या हेल्पलाइन 1800-111-555 (टोल फ्री) वर कॉल करा किंवा CSC केंद्राला भेट द्या.",

    "home.startEligibilityQuiz": "पात्रता क्विझ सुरू करा",

    "dashboard.savedSchemes": "जतन योजना",
    "dashboard.quizHistory": "क्विझ इतिहास",
    "dashboard.myProfile": "माझी प्रोफाइल",
    "dashboard.signOut": "साइन आउट",
    "dashboard.discoverMore": "आणखी शोधा",
    "dashboard.newQuiz": "नवीन क्विझ",
    "dashboard.updateProfileHint": "चांगल्या जुळणीसाठी प्रोफाइल अपडेट करा",
    "dashboard.updateProfileDesc": "अचूक माहितीमुळे अधिक योग्य योजना मिळतात.",
    "dashboard.updateProfile": "प्रोफाइल अपडेट करा",
    "dashboard.confirmSignOut": "तुम्हाला साइन आउट करायचे आहे का?",
    "dashboard.cancel": "रद्द करा",

    "quiz.question": "प्रश्न",
    "quiz.of": "पैकी",
    "quiz.eligibleTitle": "तुमच्यासाठी पात्र योजना",
    "quiz.goDashboard": "डॅशबोर्डवर जा",

    "admin.loginTitle": "अॅडमिन पॅनेल लॉगिन",
    "admin.emailPlaceholder": "अॅडमिन ईमेल",
    "admin.passwordPlaceholder": "पासवर्ड",
    "admin.login": "लॉगिन",
    "admin.invalidCredentials": "अवैध अॅडमिन क्रेडेन्शियल",
    "admin.dashboardTitle": "YojanaSathi अॅडमिन डॅशबोर्ड",
    "admin.logout": "लॉगआउट",
    "admin.manageSchemes": "योजना व्यवस्थापन",
    "admin.manageSchemesDesc": "सरकारी योजना जोडा किंवा काढा",
    "admin.viewUsers": "वापरकर्ते पहा",
    "admin.viewUsersDesc": "नोंदणीकृत वापरकर्ते पहा",
    "admin.analytics": "विश्लेषण",
    "admin.comingSoon": "लवकरच उपलब्ध",
    "admin.registeredUsers": "नोंदणीकृत वापरकर्ते",
    "admin.noUsers": "अजून वापरकर्ते नोंदलेले नाहीत",
    "admin.action": "कारवाई",
    "admin.delete": "हटवा",
    "admin.deleteUserConfirm": "हा वापरकर्ता हटवायचा का?",
    "admin.manageGovSchemes": "सरकारी योजना व्यवस्थापन",
    "admin.addNewScheme": "नवीन योजना जोडा",
    "admin.add": "जोडा",
    "admin.platformAnalytics": "प्लॅटफॉर्म विश्लेषण",
  },
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED_LANGUAGES.includes(saved) ? saved : "en";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const t = useCallback(
    (key) => translations?.[language]?.[key] || translations.en[key] || key,
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t, translations }),
    [language, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return ctx;
};

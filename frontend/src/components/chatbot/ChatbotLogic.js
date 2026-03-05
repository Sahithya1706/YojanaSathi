import { getAllSchemes } from "utils/schemeRepository";

const SUGGESTION_KEYS = [
  "students",
  "farmer",
  "women",
  "scholarships",
  "health",
  "eligibility",
  "apply",
];

const CHATBOT_COPY = {
  en: {
    title: "AI Scheme Assistant",
    chatLabel: "Chat with AI Assistant",
    inputPlaceholder: "Type your question...",
    send: "Send",
    typing: "AI is typing...",
    languageLabel: "Language",
    greeting:
      "Hello! I am your YojanaSathi AI assistant. I can help you find government schemes.",
    fallback:
      "I can help with schemes for students, farmers, women, scholarships, health, eligibility, and application steps.",
    responses: {
      students: "Here are student-focused schemes you can explore:",
      farmer: "These farmer schemes may help you:",
      women: "These women-focused schemes are available:",
      scholarships: "You can apply for these scholarship schemes:",
      health: "These health schemes are available:",
      eligibility:
        "Use the Eligibility Checker to verify fit. Share your age, income, occupation, and state for better guidance.",
      apply:
        "Open a scheme card and click Apply to visit the official portal. Keep Aadhaar, income, and bank documents ready.",
    },
    suggestions: {
      students: "Find schemes for students",
      farmer: "Farmer schemes",
      women: "Women schemes",
      scholarships: "Scholarships",
      health: "Health schemes",
      eligibility: "Check eligibility",
      apply: "How to apply",
    },
    actions: {
      viewDetails: "View Details",
      apply: "Apply",
    },
  },
  hi: {
    title: "AI योजना सहायक",
    chatLabel: "AI सहायक से चैट करें",
    inputPlaceholder: "अपना प्रश्न लिखें...",
    send: "भेजें",
    typing: "AI टाइप कर रहा है...",
    languageLabel: "भाषा",
    greeting:
      "नमस्ते! मैं आपका YojanaSathi AI सहायक हूँ। मैं सरकारी योजनाएँ खोजने में आपकी मदद कर सकता हूँ।",
    fallback:
      "मैं छात्रों, किसानों, महिलाओं, छात्रवृत्ति, स्वास्थ्य, पात्रता और आवेदन प्रक्रिया में मदद कर सकता हूँ।",
    responses: {
      students: "छात्रों के लिए ये योजनाएँ देख सकते हैं:",
      farmer: "किसानों के लिए ये योजनाएँ उपयोगी हो सकती हैं:",
      women: "महिलाओं के लिए ये योजनाएँ उपलब्ध हैं:",
      scholarships: "आप इन छात्रवृत्ति योजनाओं के लिए आवेदन कर सकते हैं:",
      health: "ये स्वास्थ्य योजनाएँ उपलब्ध हैं:",
      eligibility:
        "पात्रता जांचने के लिए Eligibility Checker उपयोग करें। बेहतर सुझाव के लिए अपनी उम्र, आय, पेशा और राज्य बताएं।",
      apply:
        "किसी योजना कार्ड पर Apply बटन दबाकर आधिकारिक पोर्टल पर जाएँ। आधार, आय और बैंक दस्तावेज तैयार रखें।",
    },
    suggestions: {
      students: "छात्रों के लिए योजनाएँ",
      farmer: "किसान योजनाएँ",
      women: "महिला योजनाएँ",
      scholarships: "छात्रवृत्तियाँ",
      health: "स्वास्थ्य योजनाएँ",
      eligibility: "पात्रता जांचें",
      apply: "आवेदन कैसे करें",
    },
    actions: {
      viewDetails: "विवरण देखें",
      apply: "आवेदन करें",
    },
  },
  mr: {
    title: "AI योजना सहाय्यक",
    chatLabel: "AI सहाय्यकाशी चॅट करा",
    inputPlaceholder: "तुमचा प्रश्न लिहा...",
    send: "पाठवा",
    typing: "AI टाइप करत आहे...",
    languageLabel: "भाषा",
    greeting:
      "नमस्कार! मी तुमचा YojanaSathi AI सहाय्यक आहे. मी तुम्हाला सरकारी योजना शोधण्यात मदत करू शकतो.",
    fallback:
      "मी विद्यार्थी, शेतकरी, महिला, शिष्यवृत्ती, आरोग्य, पात्रता आणि अर्ज प्रक्रियेत मदत करू शकतो.",
    responses: {
      students: "विद्यार्थ्यांसाठी या योजना पाहू शकता:",
      farmer: "शेतकऱ्यांसाठी या योजना उपयुक्त ठरू शकतात:",
      women: "महिलांसाठी या योजना उपलब्ध आहेत:",
      scholarships: "तुम्ही या शिष्यवृत्ती योजनांसाठी अर्ज करू शकता:",
      health: "या आरोग्य योजना उपलब्ध आहेत:",
      eligibility:
        "पात्रता तपासण्यासाठी Eligibility Checker वापरा. अधिक अचूक मार्गदर्शनासाठी वय, उत्पन्न, व्यवसाय आणि राज्य सांगा.",
      apply:
        "योजना कार्डवरील Apply बटनावर क्लिक करून अधिकृत पोर्टलवर जा. आधार, उत्पन्न आणि बँक कागदपत्रे तयार ठेवा.",
    },
    suggestions: {
      students: "विद्यार्थी योजना",
      farmer: "शेतकरी योजना",
      women: "महिला योजना",
      scholarships: "शिष्यवृत्ती",
      health: "आरोग्य योजना",
      eligibility: "पात्रता तपासा",
      apply: "अर्ज कसा करायचा",
    },
    actions: {
      viewDetails: "तपशील पहा",
      apply: "अर्ज करा",
    },
  },
};

const KEYWORDS = {
  students: ["student", "students", "education", "edu", "विद्यार्थी", "छात्र", "शिक्षण"],
  farmer: ["farmer", "farm", "kisan", "agri", "किसान", "कृषि", "शेतकरी", "कृषी"],
  women: ["women", "woman", "female", "mahila", "महिला", "स्त्री", "बेटी"],
  scholarships: [
    "scholarship",
    "scholarships",
    "stipend",
    "शिष्यवृत्ती",
    "शिष्यवृत्ति",
    "छात्रवृत्ति",
  ],
  health: ["health", "medical", "hospital", "insurance", "आरोग्य", "स्वास्थ्य", "आयुष्मान"],
  eligibility: ["eligibility", "eligible", "पात्र", "पात्रता", "योग्य"],
  apply: ["apply", "application", "register", "आवेदन", "अर्ज", "नोंदणी"],
};

const FALLBACK_SCHOLARSHIP_SCHEMES = [
  {
    id: "nsp-fallback",
    name: "National Scholarship Portal",
    description: "Central scholarship platform for eligible students.",
    applyLink: "https://scholarships.gov.in",
    detailsPath: "",
  },
  {
    id: "post-matric-fallback",
    name: "Post Matric Scholarship",
    description: "Scholarship support for post-matric studies.",
    applyLink: "https://scholarships.gov.in",
    detailsPath: "",
  },
  {
    id: "pre-matric-fallback",
    name: "Pre Matric Scholarship",
    description: "Scholarship support for school students.",
    applyLink: "https://scholarships.gov.in",
    detailsPath: "",
  },
];

const normalize = (value) => String(value || "").trim().toLowerCase();

const getCopy = (language) => CHATBOT_COPY[language] || CHATBOT_COPY.en;

const createId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const toSchemeCard = (scheme, hasInternalDetails = true) => ({
  id: String(scheme?.id || createId("scheme")),
  name: scheme?.name || "Government Scheme",
  description:
    scheme?.description ||
    scheme?.benefit ||
    "Official government scheme information is available on the portal.",
  applyLink: scheme?.applyLink || scheme?.officialLink || scheme?.portalUrl || "",
  detailsPath: hasInternalDetails && scheme?.id ? `/scheme/${scheme.id}` : "",
});

const includesAny = (message, words = []) => words.some((word) => normalize(message).includes(normalize(word)));

const getSchemes = () => getAllSchemes();

const pickSchemes = (source, matcher, limit = 3) =>
  source.filter(matcher).slice(0, limit).map((scheme) => toSchemeCard(scheme));

const getScholarshipSchemes = (source) => {
  const findByName = (fragment) => source.find((scheme) => normalize(scheme?.name).includes(normalize(fragment)));

  const nsp = findByName("national scholarship portal") || source.find((scheme) => normalize(scheme?.id) === "nsp");
  const postMatric = findByName("post matric scholarship");
  const preMatric = findByName("pre matric scholarship");

  const schemeCards = [
    nsp ? toSchemeCard(nsp) : FALLBACK_SCHOLARSHIP_SCHEMES[0],
    postMatric ? toSchemeCard(postMatric) : FALLBACK_SCHOLARSHIP_SCHEMES[1],
    preMatric ? toSchemeCard(preMatric) : FALLBACK_SCHOLARSHIP_SCHEMES[2],
  ];

  return schemeCards;
};

const getSchemesByIntent = (intent) => {
  const source = getSchemes();

  switch (intent) {
    case "students":
      return pickSchemes(
        source,
        (scheme) =>
          ["education", "skill"].includes(normalize(scheme?.category)) ||
          includesAny(scheme?.name, KEYWORDS.students) ||
          includesAny(scheme?.description, KEYWORDS.students),
        3
      );

    case "farmer":
      return pickSchemes(
        source,
        (scheme) =>
          ["farmer", "agriculture"].includes(normalize(scheme?.category)) ||
          includesAny(scheme?.name, KEYWORDS.farmer) ||
          includesAny(scheme?.description, KEYWORDS.farmer),
        3
      );

    case "women":
      return pickSchemes(
        source,
        (scheme) =>
          ["women", "female"].includes(normalize(scheme?.category)) ||
          includesAny(scheme?.name, KEYWORDS.women) ||
          includesAny(scheme?.description, KEYWORDS.women),
        3
      );

    case "health":
      return pickSchemes(
        source,
        (scheme) =>
          ["health", "insurance"].includes(normalize(scheme?.category)) ||
          includesAny(scheme?.name, KEYWORDS.health) ||
          includesAny(scheme?.description, KEYWORDS.health),
        3
      );

    case "scholarships":
      return getScholarshipSchemes(source);

    default:
      return [];
  }
};

export const getChatbotCopy = (language) => getCopy(language);

export const getSuggestions = (language) => {
  const copy = getCopy(language);
  return SUGGESTION_KEYS.map((key) => ({ key, label: copy?.suggestions?.[key] || key }));
};

export const createGreetingMessage = (language) => ({
  id: createId("bot"),
  sender: "bot",
  text: getCopy(language).greeting,
  showSuggestions: true,
  suggestionKeys: SUGGESTION_KEYS,
  isGreeting: true,
});

export const createUserMessage = (text) => ({
  id: createId("user"),
  sender: "user",
  text,
});

export const detectIntent = (message) => {
  if (!message) return null;

  if (includesAny(message, KEYWORDS.scholarships)) return "scholarships";
  if (includesAny(message, KEYWORDS.farmer)) return "farmer";
  if (includesAny(message, KEYWORDS.women)) return "women";
  if (includesAny(message, KEYWORDS.health)) return "health";
  if (includesAny(message, KEYWORDS.students)) return "students";
  if (includesAny(message, KEYWORDS.eligibility)) return "eligibility";
  if (includesAny(message, KEYWORDS.apply)) return "apply";

  return null;
};

export const getBotReply = ({ language, message, intent }) => {
  const copy = getCopy(language);
  const resolvedIntent = intent || detectIntent(message);

  if (!resolvedIntent) {
    return {
      id: createId("bot"),
      sender: "bot",
      text: copy.fallback,
      schemes: [],
      showSuggestions: true,
      suggestionKeys: SUGGESTION_KEYS,
    };
  }

  const schemes = getSchemesByIntent(resolvedIntent);

  return {
    id: createId("bot"),
    sender: "bot",
    text: copy.responses?.[resolvedIntent] || copy.fallback,
    schemes,
    showSuggestions: ["eligibility", "apply"].includes(resolvedIntent),
    suggestionKeys: SUGGESTION_KEYS,
  };
};

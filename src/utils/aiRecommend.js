import { schemes as defaultSchemes } from "data/schemes";

const normalizeText = (value) => String(value || "").trim().toLowerCase();

const parseIncome = (value) => {
  const numeric = Number(value);
  if (!Number.isNaN(numeric) && numeric > 0) return numeric;

  const text = normalizeText(value);
  if (text.includes("below") && text.includes("100000")) return 100000;
  if (text.includes("1l") && text.includes("3l")) return 300000;
  if (text.includes("3l") && text.includes("6l")) return 600000;
  if (text.includes("above") && text.includes("6l")) return 1000000;
  return null;
};

const parseAge = (value) => {
  const numeric = Number(value);
  if (!Number.isNaN(numeric) && numeric > 0) return numeric;

  const text = normalizeText(value);
  if (text === "18-25") return 22;
  if (text === "26-35") return 30;
  if (text === "36-50") return 43;
  if (text === "51-60") return 55;
  if (text === "60+") return 62;
  return null;
};

const getSchemeDatabase = () => {
  const stored = JSON.parse(localStorage.getItem("schemes") || "[]");
  if (Array.isArray(stored) && stored.length > 0) {
    return stored.map((scheme) => ({
      ...scheme,
      occupation: Array.isArray(scheme?.occupation) ? scheme.occupation : ["any"],
      states: Array.isArray(scheme?.states) ? scheme.states : ["all"],
      incomeLimit: Number(scheme?.incomeLimit || scheme?.maxIncome || 1000000),
      minAge: Number(scheme?.minAge || 0),
      gender: scheme?.gender || "any",
      requiresLandOwnership: Boolean(scheme?.requiresLandOwnership),
    }));
  }

  return defaultSchemes;
};

const matchScheme = (scheme, profile) => {
  const occupationAllowed =
    (scheme?.occupation || []).map(normalizeText).includes("any") ||
    (scheme?.occupation || []).map(normalizeText).includes(profile.occupation);

  if (!occupationAllowed) return { eligible: false, score: 0, reason: "" };

  if (profile.age != null && profile.age < Number(scheme?.minAge || 0)) {
    return { eligible: false, score: 0, reason: "" };
  }

  if (profile.income != null && profile.income > Number(scheme?.incomeLimit || 0)) {
    return { eligible: false, score: 0, reason: "" };
  }

  if (scheme?.gender && normalizeText(scheme.gender) !== "any" && normalizeText(scheme.gender) !== profile.gender) {
    return { eligible: false, score: 0, reason: "" };
  }

  const allowedCategories = (scheme?.categoryEligibility || []).map(normalizeText);
  if (allowedCategories.length > 0 && !allowedCategories.includes(profile.category)) {
    return { eligible: false, score: 0, reason: "" };
  }

  const allowedStates = (scheme?.states || []).map(normalizeText);
  if (!allowedStates.includes("all") && !allowedStates.includes(profile.state)) {
    return { eligible: false, score: 0, reason: "" };
  }

  if (scheme?.requiresLandOwnership && !profile.hasLand) {
    return { eligible: false, score: 0, reason: "" };
  }

  if (scheme?.requiresStudent && !profile.isStudent) {
    return { eligible: false, score: 0, reason: "" };
  }

  let score = 60;
  const reasons = [];

  if (profile.occupation && (scheme?.occupation || []).map(normalizeText).includes(profile.occupation)) {
    score += 20;
    reasons.push(`occupation ${profile.occupation}`);
  }
  if (profile.income != null) {
    score += 10;
    reasons.push(`income under Rs ${scheme.incomeLimit}`);
  }
  if (profile.state && !allowedStates.includes("all")) {
    score += 5;
    reasons.push(`state ${profile.state}`);
  }
  if (profile.category && allowedCategories.includes(profile.category)) {
    score += 5;
    reasons.push(`category ${profile.category}`);
  }

  return {
    eligible: true,
    score,
    reason:
      reasons.length > 0
        ? `Matched by ${reasons.join(", ")}.`
        : "Matched based on your demographic profile.",
  };
};

const buildProfile = (answers) => {
  const normalizedOccupation = normalizeText(answers?.occupation).replaceAll(" ", "_");
  return {
    age: parseAge(answers?.age),
    income: parseIncome(answers?.income),
    occupation: normalizedOccupation,
    category: normalizeText(answers?.category),
    state: normalizeText(answers?.state),
    gender: normalizeText(answers?.gender),
    hasLand: normalizeText(answers?.landOwnership) === "yes",
    isStudent: normalizeText(answers?.studentStatus) === "yes",
  };
};

export const recommendSchemesFromAnswers = (answers = {}, options = {}) => {
  const { limit = 8 } = options;
  const profile = buildProfile(answers);
  const schemes = getSchemeDatabase();

  const recommendations = schemes
    .map((scheme) => {
      const outcome = matchScheme(scheme, profile);
      if (!outcome.eligible) return null;
      return {
        ...scheme,
        confidence: outcome.score,
        reason: outcome.reason,
      };
    })
    .filter(Boolean)
    .sort((left, right) => right.confidence - left.confidence)
    .slice(0, limit);

  return { profile, recommendations };
};

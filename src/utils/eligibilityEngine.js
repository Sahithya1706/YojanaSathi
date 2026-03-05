import { schemes } from "../data/schemes";
import { recommendSchemesFromAnswers } from "./aiRecommend";

export function matchSchemes(user){

return schemes.filter(scheme =>{

const ageMatch =
user.age >= scheme.minAge;

const incomeMatch =
user.income <= (scheme.incomeLimit ?? scheme.maxIncome ?? Number.MAX_SAFE_INTEGER);

const occupationMatch =
(scheme.occupation || []).map((value) => String(value).toLowerCase()).includes("any") ||
(scheme.occupation || []).map((value) => String(value).toLowerCase()).includes(String(user.occupation || "").toLowerCase());

return ageMatch && incomeMatch && occupationMatch;

})

}

export function getAiMatchedSchemes(answers, options = {}) {
  const { recommendations } = recommendSchemesFromAnswers(answers, options);
  return recommendations;
}

const normalize = (value) => String(value || "").trim().toLowerCase();

const EXTRA_CHECKER_SCHEMES = [
  {
    id: "checker-pmkisan",
    name: "PM Kisan Samman Nidhi",
    category: "Agriculture",
    minAge: 18,
    maxIncome: 200000,
    occupation: ["Farmer"],
    benefit: "Rs 6,000 per year direct income support",
  },
  {
    id: "checker-fasal",
    name: "Pradhan Mantri Fasal Bima Yojana",
    category: "Agriculture",
    minAge: 18,
    maxIncome: 600000,
    occupation: ["Farmer", "Any"],
    benefit: "Crop insurance support for farmers",
  },
  {
    id: "checker-kcc",
    name: "Kisan Credit Card",
    category: "Agriculture",
    minAge: 18,
    maxIncome: 500000,
    occupation: ["Farmer"],
    benefit: "Short-term credit support for farming",
  },
  {
    id: "checker-scholarship",
    name: "National Scholarship Schemes",
    category: "Education",
    minAge: 16,
    maxIncome: 800000,
    occupation: ["Student"],
    benefit: "Scholarship support for eligible students",
  },
];

const getSchemePool = () => {
  const fromStorage = JSON.parse(localStorage.getItem("schemes") || "[]");
  const base = Array.isArray(fromStorage) && fromStorage.length > 0 ? fromStorage : schemes;

  const merged = [...base, ...EXTRA_CHECKER_SCHEMES];
  const byName = new Map();
  merged.forEach((item, index) => {
    const key = normalize(item?.name);
    if (!key || byName.has(key)) return;
    byName.set(key, { ...item, id: item?.id || `scheme-${index}` });
  });
  return Array.from(byName.values());
};

const matchesOccupation = (scheme, occupation) => {
  const schemeOccupations = Array.isArray(scheme?.occupation)
    ? scheme.occupation.map((item) => normalize(item))
    : [];
  if (schemeOccupations.length === 0 || schemeOccupations.includes("any")) return true;

  const userOccupation = normalize(occupation);
  if (schemeOccupations.includes(userOccupation)) return true;

  if (userOccupation === "self employed" || userOccupation === "self-employed") {
    return schemeOccupations.includes("self-employed") || schemeOccupations.includes("self employed");
  }

  return false;
};

const buildRuleResult = (scheme, profile) => {
  const checks = [];

  if (typeof scheme?.minAge === "number") {
    checks.push({
      key: "age",
      passed: Number(profile.age) >= scheme.minAge,
      reason: `minimum age ${scheme.minAge}`,
    });
  }

  if (typeof scheme?.maxIncome === "number") {
    checks.push({
      key: "income",
      passed: Number(profile.income) <= scheme.maxIncome,
      reason: `income up to Rs ${scheme.maxIncome.toLocaleString("en-IN")}`,
    });
  }

  if (Array.isArray(scheme?.occupation) && scheme.occupation.length > 0) {
    checks.push({
      key: "occupation",
      passed: matchesOccupation(scheme, profile.occupation),
      reason: `occupation in ${scheme.occupation.join(", ")}`,
    });
  }

  if (Array.isArray(scheme?.categories) && scheme.categories.length > 0) {
    checks.push({
      key: "category",
      passed: scheme.categories.map((item) => normalize(item)).includes(normalize(profile.category)),
      reason: `category in ${scheme.categories.join(", ")}`,
    });
  }

  if (Array.isArray(scheme?.states) && scheme.states.length > 0) {
    checks.push({
      key: "state",
      passed: scheme.states.map((item) => normalize(item)).includes(normalize(profile.state)),
      reason: `state in ${scheme.states.join(", ")}`,
    });
  }

  const passedCount = checks.filter((item) => item.passed).length;
  const totalChecks = checks.length || 1;
  const ratio = passedCount / totalChecks;

  const unmet = checks.filter((item) => !item.passed).map((item) => item.reason);
  const matched = checks.filter((item) => item.passed).map((item) => item.reason);

  return {
    scheme,
    ratio,
    checks,
    explanation:
      unmet.length === 0
        ? "All major eligibility criteria matched."
        : `Matched: ${matched.join(", ") || "basic profile"} | Missing: ${unmet.join(", ")}`,
  };
};

export function evaluateEligibility(profileInput) {
  const profile = {
    age: Number(profileInput?.age || 0),
    income: Number(profileInput?.income || 0),
    occupation: profileInput?.occupation || "",
    category: profileInput?.category || "",
    state: profileInput?.state || "",
  };

  const pool = getSchemePool();
  const evaluated = pool.map((scheme) => buildRuleResult(scheme, profile));

  const eligible = evaluated
    .filter((item) => item.ratio >= 1)
    .map((item) => ({ ...item.scheme, explanation: item.explanation }));

  const partiallyEligible = evaluated
    .filter((item) => item.ratio >= 0.5 && item.ratio < 1)
    .map((item) => ({ ...item.scheme, explanation: item.explanation }));

  const notEligible = evaluated
    .filter((item) => item.ratio < 0.5)
    .map((item) => ({ ...item.scheme, explanation: item.explanation }));

  return {
    eligible,
    partiallyEligible,
    notEligible,
  };
}

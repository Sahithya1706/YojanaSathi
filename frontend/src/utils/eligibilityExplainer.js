const normalize = (value) => String(value || "").trim().toLowerCase();

const formatValue = (value) =>
  String(value || "")
    .replaceAll("_", " ")
    .replace(/\s+/g, " ")
    .trim();

const toNumber = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

const inferRulesByCategory = (scheme) => {
  const category = normalize(scheme?.category);

  if (category === "farmer" || category === "agriculture") {
    return {
      occupation: ["farmer"],
      incomeLimit: 800000,
      suggestions: [
        "Provide land or farming proof while applying.",
        "Keep an updated income certificate ready.",
      ],
    };
  }

  if (category === "education" || category === "scholarship") {
    return {
      occupation: ["student"],
      incomeLimit: 800000,
      suggestions: [
        "Keep academic documents and caste/income certificates ready.",
      ],
    };
  }

  if (category === "women") {
    return {
      gender: "female",
      suggestions: [
        "Check women-focused state schemes if this one does not fit.",
      ],
    };
  }

  if (category === "health" || category === "insurance") {
    return {
      incomeLimit: 500000,
      suggestions: [
        "Verify family income and category details on the official portal.",
      ],
    };
  }

  return {};
};

const pushUnique = (list, value) => {
  if (!value) return;
  if (!list.includes(value)) list.push(value);
};

const buildCheck = ({
  isActive,
  passed,
  weight,
  eligibleReason,
  notEligibleReason,
  suggestion,
}) => ({
  isActive: Boolean(isActive),
  passed: Boolean(passed),
  weight,
  eligibleReason,
  notEligibleReason,
  suggestion,
});

export function explainEligibility(userProfile = {}, scheme = {}) {
  const inferred = inferRulesByCategory(scheme);

  const profile = {
    age: toNumber(userProfile?.age),
    income: toNumber(userProfile?.income),
    occupation: normalize(userProfile?.occupation),
    category: normalize(userProfile?.category),
    state: normalize(userProfile?.state),
    gender: normalize(userProfile?.gender),
    hasLand: normalize(userProfile?.landOwnership) === "yes" || userProfile?.hasLand === true,
    isStudent: normalize(userProfile?.studentStatus) === "yes" || userProfile?.isStudent === true,
  };

  const occupationRules = Array.isArray(scheme?.occupation) && scheme.occupation.length > 0
    ? scheme.occupation.map(normalize)
    : Array.isArray(inferred?.occupation)
      ? inferred.occupation.map(normalize)
      : [];

  const hasOccupationConstraint =
    occupationRules.length > 0 && !occupationRules.includes("any");

  const incomeLimit = toNumber(scheme?.incomeLimit ?? scheme?.maxIncome ?? inferred?.incomeLimit);
  const minAge = toNumber(scheme?.minAge);

  const genderRule = normalize(scheme?.gender || inferred?.gender);
  const hasGenderConstraint = genderRule && genderRule !== "any";

  const states = Array.isArray(scheme?.states) ? scheme.states.map(normalize) : [];
  const hasStateConstraint = states.length > 0 && !states.includes("all");

  const categoryEligibility = Array.isArray(scheme?.categoryEligibility)
    ? scheme.categoryEligibility.map(normalize)
    : Array.isArray(scheme?.categories)
      ? scheme.categories.map(normalize)
      : [];
  const hasCategoryConstraint = categoryEligibility.length > 0;

  const checks = [
    buildCheck({
      isActive: hasOccupationConstraint,
      passed: hasOccupationConstraint
        ? occupationRules.includes(profile.occupation)
        : true,
      weight: 35,
      eligibleReason: hasOccupationConstraint
        ? `Your occupation matches scheme requirements (${formatValue(profile.occupation)}).`
        : "",
      notEligibleReason: hasOccupationConstraint
        ? `This scheme prefers ${occupationRules.map(formatValue).join(", ")} occupation profiles.`
        : "",
      suggestion: hasOccupationConstraint
        ? "Try occupation-specific alternatives if your occupation differs."
        : "",
    }),
    buildCheck({
      isActive: Number.isFinite(incomeLimit),
      passed: Number.isFinite(incomeLimit) && profile.income != null
        ? profile.income <= incomeLimit
        : false,
      weight: 25,
      eligibleReason: Number.isFinite(incomeLimit)
        ? `Your income is within the scheme limit (up to Rs ${incomeLimit.toLocaleString("en-IN")}).`
        : "",
      notEligibleReason: Number.isFinite(incomeLimit)
        ? `Income appears above the scheme limit of Rs ${incomeLimit.toLocaleString("en-IN")}.`
        : "",
      suggestion: Number.isFinite(incomeLimit)
        ? "Upload a valid and latest income certificate while applying."
        : "",
    }),
    buildCheck({
      isActive: Number.isFinite(minAge),
      passed: Number.isFinite(minAge) && profile.age != null ? profile.age >= minAge : false,
      weight: 15,
      eligibleReason: Number.isFinite(minAge)
        ? `Your age satisfies the minimum requirement (${minAge}+ years).`
        : "",
      notEligibleReason: Number.isFinite(minAge)
        ? `Age requirement may not be met (minimum ${minAge} years).`
        : "",
      suggestion: Number.isFinite(minAge)
        ? "Check age-specific variants of this scheme."
        : "",
    }),
    buildCheck({
      isActive: hasGenderConstraint,
      passed: hasGenderConstraint ? profile.gender === genderRule : true,
      weight: 10,
      eligibleReason: hasGenderConstraint
        ? `Your gender matches this scheme preference (${formatValue(genderRule)}).`
        : "",
      notEligibleReason: hasGenderConstraint
        ? `This scheme is targeted to ${formatValue(genderRule)} applicants.`
        : "",
      suggestion: hasGenderConstraint
        ? "Explore general schemes without gender restrictions."
        : "",
    }),
    buildCheck({
      isActive: Boolean(scheme?.requiresStudent),
      passed: Boolean(scheme?.requiresStudent) ? profile.isStudent : true,
      weight: 8,
      eligibleReason: scheme?.requiresStudent
        ? "You indicated that you are currently a student."
        : "",
      notEligibleReason: scheme?.requiresStudent
        ? "This scheme expects active student status."
        : "",
      suggestion: scheme?.requiresStudent
        ? "Keep enrollment proof ready or select non-student schemes."
        : "",
    }),
    buildCheck({
      isActive: Boolean(scheme?.requiresLandOwnership),
      passed: Boolean(scheme?.requiresLandOwnership) ? profile.hasLand : true,
      weight: 7,
      eligibleReason: scheme?.requiresLandOwnership
        ? "You indicated land ownership required by this scheme."
        : "",
      notEligibleReason: scheme?.requiresLandOwnership
        ? "This scheme expects agricultural land ownership."
        : "",
      suggestion: scheme?.requiresLandOwnership
        ? "Keep land documents ready or explore schemes without land criteria."
        : "",
    }),
    buildCheck({
      isActive: hasStateConstraint,
      passed: hasStateConstraint ? states.includes(profile.state) : true,
      weight: 6,
      eligibleReason: hasStateConstraint
        ? `Your state appears in this scheme's coverage list.`
        : "",
      notEligibleReason: hasStateConstraint
        ? `This scheme may be limited to: ${states.map(formatValue).join(", ")}.`
        : "",
      suggestion: hasStateConstraint
        ? "Check state-level portals for alternatives in your region."
        : "",
    }),
    buildCheck({
      isActive: hasCategoryConstraint,
      passed: hasCategoryConstraint ? categoryEligibility.includes(profile.category) : true,
      weight: 4,
      eligibleReason: hasCategoryConstraint
        ? "Your social category aligns with scheme preferences."
        : "",
      notEligibleReason: hasCategoryConstraint
        ? `Category preference is: ${categoryEligibility.map(formatValue).join(", ")}.`
        : "",
      suggestion: hasCategoryConstraint
        ? "Verify category certificate and look for broader schemes."
        : "",
    }),
  ].filter((check) => check.isActive);

  const reasonsEligible = [];
  const reasonsNotEligible = [];
  const improvementSuggestions = [];

  if (checks.length === 0) {
    reasonsEligible.push("Your profile broadly matches this scheme category.");
    reasonsNotEligible.push("Detailed criteria are limited; final decision depends on official verification.");
    improvementSuggestions.push("Review official guidelines before applying.");
    return {
      score: 70,
      reasonsEligible,
      reasonsNotEligible,
      improvementSuggestions,
    };
  }

  const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0);
  const passedWeight = checks.reduce((sum, check) => sum + (check.passed ? check.weight : 0), 0);

  checks.forEach((check) => {
    if (check.passed) {
      pushUnique(reasonsEligible, check.eligibleReason);
      return;
    }
    pushUnique(reasonsNotEligible, check.notEligibleReason);
    pushUnique(improvementSuggestions, check.suggestion);
  });

  (inferred?.suggestions || []).forEach((tip) => pushUnique(improvementSuggestions, tip));

  if (reasonsEligible.length === 0) {
    pushUnique(reasonsEligible, "Your profile was evaluated against available scheme rules.");
  }
  if (reasonsNotEligible.length === 0) {
    pushUnique(reasonsNotEligible, "No major disqualifying criteria were detected from available data.");
  }
  if (improvementSuggestions.length === 0) {
    pushUnique(improvementSuggestions, "Keep profile details and required documents updated before applying.");
  }

  return {
    score: clamp(Math.round((passedWeight / totalWeight) * 100)),
    reasonsEligible,
    reasonsNotEligible,
    improvementSuggestions: improvementSuggestions.slice(0, 4),
  };
}

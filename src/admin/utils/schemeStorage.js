import { schemes as defaultSchemes } from "data/schemes";

const STORAGE_KEY = "schemes";

const normalizeScheme = (scheme, index) => {
  if (typeof scheme === "string") {
    return {
      id: `legacy-${index}-${Date.now()}`,
      name: scheme,
      category: "General",
      occupation: ["any"],
      states: ["all"],
      incomeLimit: 1000000,
      minAge: 0,
      gender: "any",
      requiresLandOwnership: false,
      requiresStudent: false,
      ministry: "",
      benefit: "",
      description: "",
      portalUrl: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    id: scheme?.id ?? `scheme-${index}-${Date.now()}`,
    name: scheme?.name || "",
    category: scheme?.category || "General",
    occupation: Array.isArray(scheme?.occupation) ? scheme.occupation : ["any"],
    states: Array.isArray(scheme?.states) ? scheme.states : ["all"],
    incomeLimit: Number(scheme?.incomeLimit || scheme?.maxIncome || 1000000),
    minAge: Number(scheme?.minAge || 0),
    gender: scheme?.gender || "any",
    requiresLandOwnership: Boolean(scheme?.requiresLandOwnership),
    requiresStudent: Boolean(scheme?.requiresStudent),
    ministry: scheme?.ministry || "",
    benefit: scheme?.benefit || "",
    description: scheme?.description || "",
    portalUrl: scheme?.portalUrl || "",
    createdAt: scheme?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const getDefaultSchemeSeed = () =>
  (defaultSchemes || []).map((scheme, index) => normalizeScheme(scheme, index));

export const getSchemesFromStorage = () => {
  const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  if (!Array.isArray(raw) || raw.length === 0) {
    const seeded = getDefaultSchemeSeed();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  const normalized = raw.map((scheme, index) => normalizeScheme(scheme, index));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
};

export const saveSchemesToStorage = (schemes) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schemes));
};

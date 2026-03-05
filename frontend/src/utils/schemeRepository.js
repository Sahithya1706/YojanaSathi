import { schemes as defaultSchemes } from "data/schemes";

const STORAGE_KEY = "schemes";

const toArray = (value, fallback = []) => (Array.isArray(value) ? value : fallback);

const normalizeScheme = (scheme, index) => {
  const officialLink = scheme?.officialLink || scheme?.applyLink || scheme?.portalUrl || "";
  const applyLink = scheme?.applyLink || officialLink || "";
  const portalUrl = scheme?.portalUrl || applyLink || officialLink || "";

  return {
    id: scheme?.id || `scheme-${index}`,
    name: scheme?.name || "Unnamed Scheme",
    category: scheme?.category || "General",
    description:
      scheme?.description ||
      `${scheme?.name || "This scheme"} provides support for eligible citizens under government welfare programs.`,
    benefit: scheme?.benefit || "Benefit details available on official portal.",
    eligibility: toArray(scheme?.eligibility, [
      `Category: ${scheme?.category || "General"}`,
      `Minimum age: ${Number(scheme?.minAge || 0)} years`,
      `Income limit: Rs ${Number(scheme?.incomeLimit || scheme?.maxIncome || 1000000)}`,
    ]),
    documentsRequired: toArray(scheme?.documentsRequired, [
      "Aadhaar Card",
      "Income Certificate",
      "Residence Proof",
      "Bank Passbook",
    ]),
    applyLink,
    officialLink,
    portalUrl,
    ministry: scheme?.ministry || "",
    occupation: toArray(scheme?.occupation, ["any"]),
    states: toArray(scheme?.states, ["all"]),
    minAge: Number(scheme?.minAge || 0),
    incomeLimit: Number(scheme?.incomeLimit || scheme?.maxIncome || 1000000),
    gender: scheme?.gender || "any",
  };
};

export const getAllSchemes = () => {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const source = Array.isArray(stored) && stored.length > 0 ? stored : defaultSchemes;
  return source.map((scheme, index) => normalizeScheme(scheme, index));
};

export const getSchemeById = (id) => {
  const all = getAllSchemes();
  return all.find((scheme) => String(scheme.id) === String(id)) || null;
};

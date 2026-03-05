import React, { useState } from "react";
import Header from "components/ui/Header";
import AppFooter from "components/ui/AppFooter";
import Button from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import { evaluateEligibility } from "utils/eligibilityEngine";

const OCCUPATION_OPTIONS = [
  "Farmer",
  "Student",
  "Salaried",
  "Self-employed",
  "Daily Wage Worker",
  "Unemployed",
  "Other",
];

const CATEGORY_OPTIONS = ["General", "OBC", "SC", "ST", "EWS"];
const STATE_OPTIONS = ["Maharashtra", "Uttar Pradesh", "Karnataka", "Bihar", "Rajasthan", "Other"];

const ResultSection = ({ title, items, color }) => (
  <div className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
    <h3 className="text-lg font-semibold mb-3" style={{ color }}>
      {title}
    </h3>
    {items?.length > 0 ? (
      <div className="space-y-3">
        {items.map((scheme, index) => (
          <div key={`${scheme?.id || scheme?.name}-${index}`} className="rounded-lg p-3" style={{ background: "#F8FAFC" }}>
            <p className="font-semibold">{scheme?.name || "Unnamed Scheme"}</p>
            {scheme?.benefit && <p className="text-sm mt-1">{scheme.benefit}</p>}
            {scheme?.explanation && <p className="text-xs mt-2 text-slate-600">{scheme.explanation}</p>}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm text-slate-500">No schemes in this section for current inputs.</p>
    )}
  </div>
);

const EligibilityCheckerPage = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const [formData, setFormData] = useState({
    age: "",
    income: "",
    occupation: "",
    category: "",
    state: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheck = (event) => {
    event.preventDefault();
    const evaluation = evaluateEligibility(formData);
    setResult(evaluation);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    navigate("/");
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      <Header isAuthenticated={!!storedUser} user={storedUser} onLogout={handleLogout} />
      <div className="main-content-offset" />

      <main id="main-content" className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div
          className="rounded-2xl p-6 md:p-8 mb-6"
          style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-md)" }}
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
            Scheme Eligibility Checker
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
            Enter your profile details to manually check scheme eligibility.
          </p>

          <form onSubmit={handleCheck} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="number"
              name="income"
              value={formData.income}
              onChange={handleChange}
              placeholder="Annual Income (Rs)"
              className="border rounded px-3 py-2"
              required
            />
            <select name="occupation" value={formData.occupation} onChange={handleChange} className="border rounded px-3 py-2" required>
              <option value="">Select Occupation</option>
              {OCCUPATION_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select name="category" value={formData.category} onChange={handleChange} className="border rounded px-3 py-2" required>
              <option value="">Select Category</option>
              {CATEGORY_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select name="state" value={formData.state} onChange={handleChange} className="border rounded px-3 py-2" required>
              <option value="">Select State</option>
              {STATE_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <div className="flex items-center">
              <Button type="submit" iconName="Search" iconPosition="left">
                Check Eligibility
              </Button>
            </div>
          </form>
        </div>

        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ResultSection title="Eligible Schemes" items={result.eligible} color="#166534" />
            <ResultSection title="Partially Eligible" items={result.partiallyEligible} color="#9A3412" />
            <ResultSection title="Not Eligible" items={result.notEligible} color="#991B1B" />
          </div>
        )}
      </main>

      <AppFooter minimal />
    </div>
  );
};

export default EligibilityCheckerPage;


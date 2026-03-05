import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "components/ui/Header";
import AppFooter from "components/ui/AppFooter";
import Button from "components/ui/Button";
import { getCurrentUser, logout } from "utils/auth";
import { evaluateEligibility } from "utils/eligibilityEngine";
import { explainEligibility } from "utils/eligibilityExplainer";

const formatKey = (value) =>
  String(value || "")
    .replace(/([A-Z])/g, " $1")
    .replaceAll("_", " ")
    .replace(/^./, (char) => char.toUpperCase());

const formatValue = (value) => {
  if (value == null || value === "") return "-";
  if (String(value).match(/^\d+$/) && Number(value) > 9999) return `Rs ${value}`;
  return String(value).replaceAll("_", " ");
};

const normalizeText = (value) => String(value || "").trim().toLowerCase();

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

const QuizResultPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [notice, setNotice] = useState("");
  const [expandedExplainers, setExpandedExplainers] = useState({});

  const recentResult = useMemo(
    () => JSON.parse(localStorage.getItem("recentQuizResult") || "null"),
    []
  );

  const eligibilityProfile = useMemo(() => {
    if (!recentResult?.answers) return null;
    return {
      age: Number(recentResult.answers?.age || 0),
      income: Number(recentResult.answers?.income || 0),
      occupation: recentResult.answers?.occupation || "",
      category: recentResult.answers?.category || "",
      state: recentResult.answers?.state || "",
      gender: recentResult.answers?.gender || "",
      landOwnership: recentResult.answers?.landOwnership || "no",
      studentStatus: recentResult.answers?.studentStatus || "no",
    };
  }, [recentResult]);

  const ruleInsightsByName = useMemo(() => {
    if (!eligibilityProfile) return new Map();

    const evaluated = evaluateEligibility({
      age: eligibilityProfile.age,
      income: eligibilityProfile.income,
      occupation: eligibilityProfile.occupation,
      category: eligibilityProfile.category,
      state: eligibilityProfile.state,
    });

    const map = new Map();
    (evaluated.eligible || []).forEach((item) => {
      map.set(normalizeText(item?.name), { level: "eligible", explanation: item?.explanation || "" });
    });
    (evaluated.partiallyEligible || []).forEach((item) => {
      map.set(normalizeText(item?.name), { level: "partial", explanation: item?.explanation || "" });
    });
    (evaluated.notEligible || []).forEach((item) => {
      map.set(normalizeText(item?.name), { level: "not", explanation: item?.explanation || "" });
    });

    return map;
  }, [eligibilityProfile]);

  const explainedRecommendations = useMemo(() => {
    const recommendations = recentResult?.recommendations || [];
    if (!eligibilityProfile) return recommendations;

    return recommendations.map((scheme) => {
      const explanation = explainEligibility(eligibilityProfile, scheme);
      const aiConfidence = Number(scheme?.confidence);
      const blendedScore = Number.isFinite(aiConfidence)
        ? clamp(Math.round((explanation.score * 0.65) + (aiConfidence * 0.35)))
        : explanation.score;

      const reasonsEligible = [...(explanation.reasonsEligible || [])];
      const reasonsNotEligible = [...(explanation.reasonsNotEligible || [])];
      const improvementSuggestions = [...(explanation.improvementSuggestions || [])];

      const ruleInsight = ruleInsightsByName.get(normalizeText(scheme?.name));
      if (ruleInsight?.explanation) {
        if (ruleInsight.level === "eligible") {
          if (!reasonsEligible.includes(ruleInsight.explanation)) reasonsEligible.push(ruleInsight.explanation);
        } else {
          if (!reasonsNotEligible.includes(ruleInsight.explanation)) reasonsNotEligible.push(ruleInsight.explanation);
          const tip = "Recheck scheme-specific criteria and required documents on the official portal.";
          if (!improvementSuggestions.includes(tip)) improvementSuggestions.push(tip);
        }
      }

      return {
        ...scheme,
        eligibilityScore: blendedScore,
        reasonsEligible,
        reasonsNotEligible,
        improvementSuggestions: improvementSuggestions.slice(0, 4),
      };
    });
  }, [eligibilityProfile, recentResult, ruleInsightsByName]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleExplainer = (schemeKey) => {
    setExpandedExplainers((current) => ({
      ...current,
      [schemeKey]: !current[schemeKey],
    }));
  };

  const saveScheme = (scheme) => {
    const saved = JSON.parse(localStorage.getItem("savedSchemes") || "[]");
    const exists = saved.some((item) => item?.id === scheme?.id || item?.name === scheme?.name);
    if (exists) {
      setNotice("Scheme is already saved.");
      return;
    }
    const updated = [
      {
        id: scheme?.id || `saved-${Date.now()}`,
        name: scheme?.name || "",
        category: scheme?.category || "General",
        ministry: scheme?.ministry || "",
        benefit: scheme?.benefit || "",
        description: scheme?.description || "",
        applyLink: scheme?.applyLink || scheme?.officialLink || scheme?.portalUrl || "",
        officialLink: scheme?.officialLink || scheme?.applyLink || scheme?.portalUrl || "",
        portalUrl: scheme?.portalUrl || "",
      },
      ...saved,
    ];
    localStorage.setItem("savedSchemes", JSON.stringify(updated));
    setNotice("Scheme saved.");
  };

  if (!recentResult) {
    return (
      <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
        <Header isAuthenticated={!!user} user={user} onLogout={handleLogout} />
        <div className="main-content-offset" />
        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="rounded-xl border bg-white p-6">
            <h1 className="text-xl font-semibold mb-2">No quiz result found</h1>
            <p className="text-sm text-slate-600 mb-4">Complete the quiz first to view your result summary.</p>
            <Button onClick={() => navigate("/quiz")}>Start Quiz</Button>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      <Header isAuthenticated={!!user} user={user} onLogout={handleLogout} />
      <div className="main-content-offset" />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="rounded-xl border bg-white p-6 md:p-8 shadow-sm">
          <h1 className="text-2xl font-bold mb-4">Quiz Result Summary</h1>

          <h2 className="text-lg font-semibold mb-3">Your Answers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {Object.entries(recentResult.answers || {})
              .filter(([key]) => key !== "submittedAt")
              .map(([key, value]) => (
                <div key={key} className="rounded-lg border bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">{formatKey(key)}</p>
                  <p className="text-sm font-semibold">{formatValue(value)}</p>
                </div>
              ))}
          </div>

          <h2 className="text-lg font-semibold mb-3">Recommended Schemes</h2>
          <div className="grid gap-3">
            {explainedRecommendations.map((scheme, index) => {
              const applyUrl = scheme?.applyLink || scheme?.officialLink || scheme?.portalUrl;
              const schemeKey = String(scheme?.id || scheme?.name || `scheme-${index}`);
              const isExpanded = Boolean(expandedExplainers[schemeKey]);

              return (
                <div key={schemeKey} className="rounded-lg border p-4 bg-slate-50">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-semibold">{scheme?.name}</p>
                    <p className="text-sm font-semibold text-blue-700">
                      Eligibility Score: {scheme?.eligibilityScore ?? 0}%
                    </p>
                  </div>
                  <p className="text-sm mt-1">{scheme?.benefit}</p>
                  {scheme?.reason && <p className="text-xs text-slate-600 mt-2">{scheme.reason}</p>}

                  <button
                    type="button"
                    className="mt-3 text-sm font-semibold text-blue-700 underline underline-offset-2"
                    onClick={() => toggleExplainer(schemeKey)}
                  >
                    {isExpanded ? "Hide Eligibility Explanation" : "See Why You Qualify"}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                      <div>
                        <p className="text-sm font-semibold mb-2">Why you qualify:</p>
                        <ul className="space-y-1">
                          {(scheme?.reasonsEligible || []).map((reason, index) => (
                            <li key={`eligible-${index}`} className="text-sm text-slate-700">
                              {"\u2714"} {reason}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-3">
                        <p className="text-sm font-semibold mb-2">Why you may not qualify:</p>
                        <ul className="space-y-1">
                          {(scheme?.reasonsNotEligible || []).map((reason, index) => (
                            <li key={`not-eligible-${index}`} className="text-sm text-slate-700">
                              {"\u274C"} {reason}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-3">
                        <p className="text-sm font-semibold mb-2">Suggestions:</p>
                        <ul className="space-y-1">
                          {(scheme?.improvementSuggestions || []).map((tip, index) => (
                            <li key={`tip-${index}`} className="text-sm text-slate-700">
                              {"\uD83D\uDCA1"} {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/scheme/${scheme?.id}`)}>
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => saveScheme(scheme)}>
                      Save Scheme
                    </Button>
                    {applyUrl ? (
                      <Button size="sm" asChild>
                        <a href={applyUrl} target="_blank" rel="noopener noreferrer">
                          Apply
                        </a>
                      </Button>
                    ) : (
                      <Button size="sm" disabled>
                        Application link not available
                      </Button>
                    )}
                  </div>
                  {!applyUrl && (
                    <p className="text-xs text-slate-600 mt-2">Application link not available</p>
                  )}
                </div>
              );
            })}
          </div>

          {notice && <p className="text-sm mt-4 text-blue-700">{notice}</p>}

          <div className="flex gap-3 mt-6">
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
            <Button variant="outline" onClick={() => navigate("/quiz")}>
              Retake Quiz
            </Button>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
};

export default QuizResultPage;

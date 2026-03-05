import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "components/ui/Header";
import AppFooter from "components/ui/AppFooter";
import Button from "components/ui/Button";
import { getCurrentUser, logout } from "utils/auth";

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

const QuizResultPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [notice, setNotice] = useState("");

  const recentResult = useMemo(
    () => JSON.parse(localStorage.getItem("recentQuizResult") || "null"),
    []
  );

  const handleLogout = () => {
    logout();
    navigate("/");
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
        portalUrl: scheme?.portalUrl || "",
      },
      ...saved,
    ];
    localStorage.setItem("savedSchemes", JSON.stringify(updated));
    setNotice("Scheme saved.");
  };

  const applyToScheme = (scheme) => {
    if (scheme?.portalUrl) {
      window.open(scheme.portalUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setNotice("Official application link is not available for this scheme.");
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
            {(recentResult.recommendations || []).map((scheme) => (
              <div key={scheme?.id || scheme?.name} className="rounded-lg border p-4 bg-slate-50">
                <p className="font-semibold">{scheme?.name}</p>
                <p className="text-sm mt-1">{scheme?.benefit}</p>
                {scheme?.reason && <p className="text-xs text-slate-600 mt-2">{scheme.reason}</p>}
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/scheme/${scheme?.id}`)}>
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => saveScheme(scheme)}>
                    Save Scheme
                  </Button>
                  <Button size="sm" onClick={() => applyToScheme(scheme)}>
                    Apply
                  </Button>
                </div>
              </div>
            ))}
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

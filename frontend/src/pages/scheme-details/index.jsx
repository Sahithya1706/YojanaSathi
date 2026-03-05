import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "components/ui/Header";
import AppFooter from "components/ui/AppFooter";
import Button from "components/ui/Button";
import { getCurrentUser, logout } from "utils/auth";
import { getSchemeById } from "utils/schemeRepository";

const SchemeDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const user = getCurrentUser();
  const [notice, setNotice] = useState("");

  const scheme = useMemo(
    () => location?.state?.scheme || getSchemeById(id),
    [id, location?.state?.scheme]
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleApply = () => {
    if (scheme?.portalUrl) {
      window.open(scheme.portalUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setNotice("Visit your nearest CSC center to apply.");
  };

  const handleSaveScheme = () => {
    if (!scheme) return;
    const savedSchemes = JSON.parse(localStorage.getItem("savedSchemes") || "[]");
    const exists = savedSchemes.some(
      (item) => String(item?.id) === String(scheme.id) || item?.name === scheme.name
    );
    if (exists) {
      setNotice("Scheme is already saved.");
      return;
    }

    const updated = [
      {
        id: scheme.id,
        name: scheme.name,
        category: scheme.category,
        ministry: scheme.ministry,
        benefit: scheme.benefit,
        description: scheme.description,
        portalUrl: scheme.portalUrl,
      },
      ...savedSchemes,
    ];

    localStorage.setItem("savedSchemes", JSON.stringify(updated));
    setNotice("Scheme saved successfully.");
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      <Header isAuthenticated={!!user} user={user} onLogout={handleLogout} />
      <div className="main-content-offset" />

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {!scheme ? (
          <div className="rounded-xl p-6 border bg-white">
            <h1 className="text-xl font-semibold mb-2">Scheme not found</h1>
            <p className="text-sm text-slate-600 mb-4">
              The requested scheme ID does not exist.
            </p>
            <Link to="/dashboard" className="text-blue-700 underline">
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border bg-white p-6 md:p-8 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">{scheme.category}</p>
            <h1 className="text-2xl font-bold mb-3">{scheme.name}</h1>
            <p className="text-sm text-slate-700 mb-5">{scheme.description}</p>

            <section className="mb-5">
              <h2 className="text-lg font-semibold mb-2">Benefits</h2>
              <p className="text-sm text-slate-700">{scheme.benefit}</p>
            </section>

            <section className="mb-5">
              <h2 className="text-lg font-semibold mb-2">Eligibility</h2>
              <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                {(scheme.eligibility || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Documents Required</h2>
              <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                {(scheme.documentsRequired || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Apply Link</h2>
              {scheme?.portalUrl ? (
                <a
                  href={scheme.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-700 underline break-all"
                >
                  {scheme.portalUrl}
                </a>
              ) : (
                <p className="text-sm text-slate-700">Official link currently unavailable.</p>
              )}
            </section>

            {notice && (
              <p className="text-sm mb-4" style={{ color: "var(--color-accent)" }}>
                {notice}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleApply} iconName="ExternalLink" iconPosition="left">
                Apply
              </Button>
              <Button onClick={handleSaveScheme} variant="outline" iconName="BookmarkPlus" iconPosition="left">
                Save Scheme
              </Button>
              <Button onClick={() => navigate("/dashboard")} variant="ghost" iconName="ArrowLeft" iconPosition="left">
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </main>

      <AppFooter />
    </div>
  );
};

export default SchemeDetailsPage;

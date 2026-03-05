import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "components/ui/Header";
import AppFooter from "components/ui/AppFooter";
import Button from "components/ui/Button";
import { getAllSchemes } from "utils/schemeRepository";
import { getCurrentUser, logout } from "utils/auth";

const SchemesPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [notice, setNotice] = useState("");
  const [savedSchemes, setSavedSchemes] = useState(
    JSON.parse(localStorage.getItem("savedSchemes") || "[]")
  );

  const schemes = useMemo(() => getAllSchemes(), []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleViewDetails = (scheme) => {
    navigate(`/scheme/${scheme?.id}`, { state: { scheme } });
  };

  const handleSaveScheme = (scheme) => {
    const exists = savedSchemes.some(
      (item) => String(item?.id) === String(scheme?.id) || item?.name === scheme?.name
    );
    if (exists) {
      setNotice("Scheme is already saved.");
      return;
    }

    const next = [
      {
        id: scheme?.id,
        name: scheme?.name,
        category: scheme?.category || "General",
        ministry: scheme?.ministry || "",
        benefit: scheme?.benefit || "",
        description: scheme?.description || "",
        applyLink: scheme?.applyLink || scheme?.portalUrl || "",
        officialLink: scheme?.officialLink || scheme?.applyLink || scheme?.portalUrl || "",
        portalUrl: scheme?.portalUrl || "",
      },
      ...savedSchemes,
    ];

    setSavedSchemes(next);
    localStorage.setItem("savedSchemes", JSON.stringify(next));
    setNotice("Scheme saved.");
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      <Header isAuthenticated={!!user} user={user} onLogout={handleLogout} />
      <div className="main-content-offset" />

      <main id="main-content" className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "Poppins, sans-serif" }}>
            All Government Schemes
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Explore available schemes and save the ones relevant to you.
          </p>
          {notice && (
            <p className="text-sm mt-3" style={{ color: "var(--color-primary)" }}>
              {notice}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {schemes.map((scheme) => {
            const applyUrl = scheme?.applyLink || scheme?.officialLink || scheme?.portalUrl;
            return (
              <article
                key={scheme?.id}
                className="rounded-xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
              >
                <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-primary)" }}>
                  {scheme?.category || "General"}
                </p>
                <h2 className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  {scheme?.name}
                </h2>
                <p className="text-sm mt-2 line-clamp-3" style={{ color: "var(--color-text-secondary)" }}>
                  {scheme?.description || scheme?.benefit}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleViewDetails(scheme)}>
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleSaveScheme(scheme)}>
                    Save Scheme
                  </Button>
                  {applyUrl ? (
                    <Button size="sm" asChild>
                      <a href={applyUrl} target="_blank" rel="noopener noreferrer">
                        Apply Now
                      </a>
                    </Button>
                  ) : (
                    <Button size="sm" disabled>
                      Link Unavailable
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </main>

      <AppFooter />
    </div>
  );
};

export default SchemesPage;

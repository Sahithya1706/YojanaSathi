import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "components/ui/Header";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import AppFooter from "components/ui/AppFooter";
import WelcomeBanner from "./components/WelcomeBanner";
import SavedSchemesSection from "./components/SavedSchemesSection";
import QuizHistorySection from "./components/QuizHistorySection";
import ProfileSection from "./components/ProfileSection";
import StatsBar from "./components/StatsBar";
import { useLanguage } from "context/LanguageContext";
import { getCurrentUser, logout } from "utils/auth";

const TABS = [
  { id: "saved", labelKey: "dashboard.savedSchemes", icon: "BookmarkCheck" },
  { id: "history", labelKey: "dashboard.quizHistory", icon: "ClipboardList" },
  { id: "profile", labelKey: "dashboard.myProfile", icon: "User" },
];

const formatAnswerLabel = (key) => {
  if (!key) return "";
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (value) => value.toUpperCase());
};

const Dashboard = ({ initialTab = "saved" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [user, setUser] = useState(null);
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [recommendedSchemes, setRecommendedSchemes] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const storedUser = getCurrentUser();
    const storedSavedSchemes = JSON.parse(localStorage.getItem("savedSchemes") || "[]");
    const storedRecommendedSchemes = JSON.parse(localStorage.getItem("recommendedSchemes") || "[]");
    const storedQuizHistory = JSON.parse(localStorage.getItem("quizHistory") || "[]");
    const recentQuizResult = JSON.parse(localStorage.getItem("recentQuizResult") || "null");

    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setSavedSchemes(Array.isArray(storedSavedSchemes) ? storedSavedSchemes : []);
    setRecommendedSchemes(Array.isArray(storedRecommendedSchemes) ? storedRecommendedSchemes : []);

    if (Array.isArray(storedQuizHistory) && storedQuizHistory.length > 0) {
      setQuizHistory(storedQuizHistory);
    } else if (recentQuizResult) {
      setQuizHistory([recentQuizResult]);
    } else {
      setQuizHistory([]);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("saved") === "true") {
      setActiveTab("saved");
      return;
    }
    setActiveTab(initialTab);
  }, [initialTab, location.search]);

  const recentQuiz = useMemo(() => (quizHistory?.length > 0 ? quizHistory[0] : null), [quizHistory]);

  const handleStartQuiz = () => navigate("/quiz");
  const handleViewDetails = (scheme) =>
    navigate(`/scheme/${scheme?.id}`, { state: { scheme } });

  const handleSaveRecommendedScheme = (scheme) => {
    const existingSaved = JSON.parse(localStorage.getItem("savedSchemes") || "[]");
    const alreadySaved = existingSaved.some((item) => item?.id === scheme?.id || item?.name === scheme?.name);
    if (alreadySaved) return;

    const savedItem = {
      id: scheme?.id || `saved-${Date.now()}`,
      name: scheme?.name || "",
      category: scheme?.category || "General",
      ministry: scheme?.ministry || "",
      benefit: scheme?.benefit || "",
      portalUrl: scheme?.portalUrl || "",
      recommendationReason: scheme?.reason || scheme?.recommendationReason || "",
      savedAt: new Date().toISOString(),
    };

    const updated = [savedItem, ...existingSaved];
    localStorage.setItem("savedSchemes", JSON.stringify(updated));
    setSavedSchemes(updated);
  };

  const handleApplyScheme = (scheme) => {
    if (scheme?.portalUrl) {
      window.open(scheme.portalUrl, "_blank", "noopener,noreferrer");
      return;
    }
    window.alert("Visit your nearest CSC center to apply.");
  };

  const handleRemoveBookmark = (schemeId) => {
    setSavedSchemes((prev) => {
      const updated = prev?.filter((s) => s?.id !== schemeId);
      localStorage.setItem("savedSchemes", JSON.stringify(updated));
      return updated;
    });
  };

  const handleRetakeQuiz = () => navigate("/quiz");
  const handleViewResults = () => setActiveTab("history");

  const handleUpdateProfile = (data) => {
    setUser((prev) => {
      const updatedUser = { ...prev, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));

       const users = JSON.parse(localStorage.getItem("users") || "[]");
       const updatedUsers = users.map((item) =>
         String(item?.email || "").toLowerCase() === String(updatedUser?.email || "").toLowerCase()
           ? { ...item, ...updatedUser }
           : item
       );
       localStorage.setItem("users", JSON.stringify(updatedUsers));

      return updatedUser;
    });
  };

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={() => setShowLogoutConfirm(true)}
      />

      <div className="main-content-offset" />

      <main id="main-content" className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <section aria-label="Welcome banner" className="mb-6">
          <WelcomeBanner
            user={{
              ...(user || {}),
              savedCount: savedSchemes?.length,
              quizCount: quizHistory?.length,
            }}
            onStartQuiz={handleStartQuiz}
          />
        </section>

        <section aria-label="Platform statistics" className="mb-6 md:mb-8">
          <StatsBar />
        </section>

        <section aria-label="Recent quiz results" className="mb-6">
          <div
            className="rounded-2xl p-5 md:p-6"
            style={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2
                className="text-base md:text-lg font-semibold"
                style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-text-primary)" }}
              >
                Recent Quiz Result
              </h2>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("history")}>
                My Quizzes
              </Button>
            </div>

            {recentQuiz ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div
                  className="rounded-xl p-4"
                  style={{ background: "var(--color-muted)", border: "1px solid var(--color-border)" }}
                >
                  <p className="text-xs mb-2" style={{ color: "var(--color-text-secondary)" }}>
                    Quiz date: {new Date(recentQuiz?.date)?.toLocaleString()}
                  </p>
                  <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>
                    User answers
                  </p>
                  <div className="text-xs space-y-1" style={{ color: "var(--color-text-secondary)" }}>
                    {Object.entries(recentQuiz?.answers || {}).slice(0, 6).map(([key, value]) => (
                      <p key={`recent-${key}`}>
                        <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>
                          {formatAnswerLabel(key)}:
                        </span>{" "}
                        {String(value)}
                      </p>
                    ))}
                  </div>
                </div>

                <div
                  className="rounded-xl p-4"
                  style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                >
                  <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>
                    Matched schemes ({recentQuiz?.matchedSchemes || 0})
                  </p>
                  {recentQuiz?.matchedSchemeNames?.length > 0 ? (
                    <ul className="list-disc pl-4 space-y-1 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      {recentQuiz?.matchedSchemeNames?.map((name) => (
                        <li key={`recent-scheme-${name}`}>{name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      No matched schemes recorded for this attempt.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                No quiz results yet. Take a quiz to see matched schemes here.
              </p>
            )}
          </div>
        </section>

        <section aria-label="AI recommended schemes" className="mb-6">
          <div
            className="rounded-2xl p-5 md:p-6"
            style={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2
                className="text-base md:text-lg font-semibold"
                style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-text-primary)" }}
              >
                AI Recommended Schemes
              </h2>
              <Button variant="outline" size="sm" onClick={handleStartQuiz}>
                Refresh via Quiz
              </Button>
            </div>

            {recommendedSchemes?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {recommendedSchemes.slice(0, 6).map((scheme) => (
                  <div
                    key={`rec-${scheme?.id || scheme?.name}`}
                    className="rounded-xl border p-4"
                    style={{ borderColor: "var(--color-border)", background: "#F8FAFC" }}
                  >
                    <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                      {scheme?.name}
                    </p>
                    {scheme?.benefit && (
                      <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>
                        {scheme.benefit}
                      </p>
                    )}
                    {scheme?.recommendationReason && (
                      <p className="text-xs mt-2" style={{ color: "#334155" }}>
                        {scheme.recommendationReason}
                      </p>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => handleSaveRecommendedScheme(scheme)}
                    >
                      Save Scheme
                    </Button>
                    <div className="mt-2 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleViewDetails(scheme)}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleApplyScheme(scheme)}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                No AI recommendations yet. Complete the quiz to get personalized scheme recommendations.
              </p>
            )}
          </div>
        </section>

        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div
            className="flex overflow-x-auto border-b"
            style={{ borderColor: "var(--color-border)" }}
            role="tablist"
            aria-label="Dashboard sections"
          >
            {TABS?.map((tab) => (
              <button
                key={tab?.id}
                role="tab"
                aria-selected={activeTab === tab?.id}
                aria-controls={`tabpanel-${tab?.id}`}
                onClick={() => setActiveTab(tab?.id)}
                className="flex items-center gap-2 px-4 md:px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 border-b-2"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  borderBottomColor: activeTab === tab?.id ? "var(--color-primary)" : "transparent",
                  color: activeTab === tab?.id ? "var(--color-primary)" : "var(--color-text-secondary)",
                  background: activeTab === tab?.id ? "rgba(30,64,175,0.04)" : "transparent",
                }}
              >
                <Icon
                  name={tab?.icon}
                  size={18}
                  color={activeTab === tab?.id ? "var(--color-primary)" : "var(--color-muted-foreground)"}
                />
                <span>{t(tab?.labelKey)}</span>
                {tab?.id === "saved" && savedSchemes?.length > 0 && (
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
                    style={{ background: "var(--color-primary)", color: "#FFFFFF", fontFamily: "Nunito Sans, sans-serif" }}
                  >
                    {savedSchemes?.length}
                  </span>
                )}
                {tab?.id === "history" && quizHistory?.length > 0 && (
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
                    style={{ background: "var(--color-accent)", color: "#FFFFFF", fontFamily: "Nunito Sans, sans-serif" }}
                  >
                    {quizHistory?.length}
                  </span>
                )}
              </button>
            ))}

            <div className="ml-auto flex items-center px-4 hidden md:flex">
              <Button
                variant="ghost"
                size="sm"
                iconName="LogOut"
                iconPosition="left"
                onClick={() => setShowLogoutConfirm(true)}
                className="text-red-600"
              >
                {t("dashboard.signOut")}
              </Button>
            </div>
          </div>

          <div className="p-4 md:p-6">
            {activeTab === "saved" && (
              <div id="tabpanel-saved" role="tabpanel" aria-labelledby="tab-saved">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base md:text-lg font-semibold" style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-text-primary)" }}>
                    {t("dashboard.savedSchemes")}
                    {savedSchemes?.length > 0 && (
                      <span className="ml-2 text-sm font-normal" style={{ color: "var(--color-text-secondary)" }}>
                        ({savedSchemes?.length} schemes)
                      </span>
                    )}
                  </h2>
                  <Button variant="default" size="sm" iconName="Plus" iconPosition="left" onClick={handleStartQuiz}>
                    {t("dashboard.discoverMore")}
                  </Button>
                </div>
                <SavedSchemesSection
                  schemes={savedSchemes}
                  onViewDetails={handleViewDetails}
                  onRemoveBookmark={handleRemoveBookmark}
                />
              </div>
            )}

            {activeTab === "history" && (
              <div id="tabpanel-history" role="tabpanel" aria-labelledby="tab-history">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base md:text-lg font-semibold" style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-text-primary)" }}>
                    My Quizzes
                    {quizHistory?.length > 0 && (
                      <span className="ml-2 text-sm font-normal" style={{ color: "var(--color-text-secondary)" }}>
                        ({quizHistory?.length} attempts)
                      </span>
                    )}
                  </h2>
                  <Button variant="default" size="sm" iconName="PlayCircle" iconPosition="left" onClick={handleStartQuiz}>
                    {t("dashboard.newQuiz")}
                  </Button>
                </div>
                <QuizHistorySection
                  history={quizHistory}
                  onRetakeQuiz={handleRetakeQuiz}
                  onViewResults={handleViewResults}
                />
              </div>
            )}

            {activeTab === "profile" && (
              <div id="tabpanel-profile" role="tabpanel" aria-labelledby="tab-profile">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base md:text-lg font-semibold" style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-text-primary)" }}>
                    {t("dashboard.myProfile")}
                  </h2>
                </div>
                <ProfileSection user={user} onUpdateProfile={handleUpdateProfile} />

                <div className="mt-8 pt-6 border-t md:hidden" style={{ borderColor: "var(--color-border)" }}>
                  <Button
                    variant="destructive"
                    size="default"
                    iconName="LogOut"
                    iconPosition="left"
                    fullWidth
                    onClick={() => setShowLogoutConfirm(true)}
                  >
                    {t("dashboard.signOut")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className="mt-6 rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            background: "linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%)",
            border: "1px solid #FED7AA",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--color-accent)" }}
              aria-hidden="true"
            >
              <Icon name="Lightbulb" size={20} color="#FFFFFF" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ fontFamily: "Poppins, sans-serif", color: "#9A3412" }}>
                {t("dashboard.updateProfileHint")}
              </p>
              <p className="text-xs" style={{ color: "#C2410C" }}>
                {t("dashboard.updateProfileDesc")}
              </p>
            </div>
          </div>
          <Button
            variant="default"
            size="sm"
            iconName="ArrowRight"
            iconPosition="right"
            onClick={() => setActiveTab("profile")}
            style={{ background: "var(--color-accent)", border: "none", flexShrink: 0 }}
          >
            {t("dashboard.updateProfile")}
          </Button>
        </div>

        <AppFooter minimal />
      </main>

      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15,23,42,0.6)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6"
            style={{
              background: "var(--color-popover)",
              boxShadow: "var(--shadow-xl)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "#FEF2F2" }}
                aria-hidden="true"
              >
                <Icon name="LogOut" size={22} color="#DC2626" />
              </div>
              <div>
                <h3
                  id="logout-title"
                  className="text-base font-semibold"
                  style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-text-primary)" }}
                >
                  {t("dashboard.signOut")}
                </h3>
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  {t("dashboard.confirmSignOut")}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="default" fullWidth onClick={() => setShowLogoutConfirm(false)}>
                {t("dashboard.cancel")}
              </Button>
              <Button
                variant="destructive"
                size="default"
                fullWidth
                iconName="LogOut"
                iconPosition="left"
                onClick={handleLogout}
              >
                {t("dashboard.signOut")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;


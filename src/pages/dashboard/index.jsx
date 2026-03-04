import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "components/ui/Header";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import WelcomeBanner from "./components/WelcomeBanner";
import SavedSchemesSection from "./components/SavedSchemesSection";
import QuizHistorySection from "./components/QuizHistorySection";
import ProfileSection from "./components/ProfileSection";
import StatsBar from "./components/StatsBar";

const MOCK_SAVED_SCHEMES = [
  {
    id: "s1",
    name: "PM Kisan Samman Nidhi Yojana",
    category: "Agriculture",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    benefit: "₹6,000/year",
    portalUrl: "https://pmkisan.gov.in",
  },
  {
    id: "s2",
    name: "Pradhan Mantri Fasal Bima Yojana",
    category: "Agriculture",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    benefit: "Up to ₹2,00,000",
    portalUrl: "https://pmfby.gov.in",
  },
  {
    id: "s3",
    name: "Mahatma Gandhi NREGA",
    category: "Employment",
    ministry: "Ministry of Rural Development",
    benefit: "₹267/day",
    portalUrl: "https://nrega.nic.in",
  },
  {
    id: "s4",
    name: "Ayushman Bharat PM-JAY",
    category: "Health",
    ministry: "Ministry of Health & Family Welfare",
    benefit: "₹5,00,000/year",
    portalUrl: "https://pmjay.gov.in",
  },
];

const MOCK_QUIZ_HISTORY = [
  {
    id: 3,
    date: "2026-03-03T18:30:00",
    matchedSchemes: 8,
    age: 45,
    occupation: "Farmer",
    income: "Below ₹1,00,000",
    state: "Maharashtra",
  },
  {
    id: 2,
    date: "2026-02-15T10:15:00",
    matchedSchemes: 6,
    age: 45,
    occupation: "Farmer",
    income: "Below ₹1,00,000",
    state: "Maharashtra",
  },
  {
    id: 1,
    date: "2026-01-20T14:45:00",
    matchedSchemes: 5,
    age: 44,
    occupation: "Farmer",
    income: "Below ₹1,00,000",
    state: "Maharashtra",
  },
];

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "saved", label: "Saved Schemes", icon: "BookmarkCheck" },
  { id: "history", label: "Quiz History", icon: "ClipboardList" },
  { id: "profile", label: "My Profile", icon: "User" },
];

// ─── Dashboard Page ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("saved");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const [savedSchemes, setSavedSchemes] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [isAuthenticated] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleStartQuiz = () => {
    navigate("/home-page");

    setTimeout(() => {
      const quizSection = document.getElementById("quiz");
      if (quizSection) {
        quizSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };
  const handleViewDetails = (schemeId) => {
    // Navigate to scheme details — route not generated here
    navigate("/home-page");
  };

  const handleRemoveBookmark = (schemeId) => {
    setSavedSchemes((prev) => prev?.filter((s) => s?.id !== schemeId));
    setUser((prev) => ({ ...prev, savedCount: Math.max(0, prev?.savedCount - 1) }));
  };

  const handleRetakeQuiz = () => navigate("/home-page");
  const handleViewResults = () => navigate("/home-page");

  const handleUpdateProfile = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setShowLogoutConfirm(false);
    navigate("/home-page");
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-background)" }}
    >
      {/* Header */}
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={() => setShowLogoutConfirm(true)}
      />
      {/* Tricolor offset */}
      <div className="main-content-offset" />
      {/* Main */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Welcome Banner */}
        <section aria-label="Welcome banner" className="mb-6">
          <WelcomeBanner
            user={{
              ...(user || {}),
              savedCount: savedSchemes?.length,
              quizCount: quizHistory?.length,
            }} onStartQuiz={handleStartQuiz}
          />
        </section>

        {/* Stats Bar */}
        <section aria-label="Platform statistics" className="mb-6 md:mb-8">
          <StatsBar />
        </section>

        {/* Tab Navigation */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {/* Tabs */}
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
                  borderBottomColor:
                    activeTab === tab?.id ? "var(--color-primary)" : "transparent",
                  color:
                    activeTab === tab?.id
                      ? "var(--color-primary)"
                      : "var(--color-text-secondary)",
                  background:
                    activeTab === tab?.id ? "rgba(30,64,175,0.04)" : "transparent",
                }}
              >
                <Icon
                  name={tab?.icon}
                  size={18}
                  color={activeTab === tab?.id ? "var(--color-primary)" : "var(--color-muted-foreground)"}
                />
                <span>{tab?.label}</span>
                {tab?.id === "saved" && savedSchemes?.length > 0 && (
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
                    style={{
                      background: "var(--color-primary)",
                      color: "#FFFFFF",
                      fontFamily: "Nunito Sans, sans-serif",
                    }}
                    aria-label={`${savedSchemes?.length} saved schemes`}
                  >
                    {savedSchemes?.length}
                  </span>
                )}
                {tab?.id === "history" && quizHistory?.length > 0 && (
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
                    style={{
                      background: "var(--color-accent)",
                      color: "#FFFFFF",
                      fontFamily: "Nunito Sans, sans-serif",
                    }}
                    aria-label={`${quizHistory?.length} quiz attempts`}
                  >
                    {quizHistory?.length}
                  </span>
                )}
              </button>
            ))}

            {/* Logout button in tab bar - desktop */}
            <div className="ml-auto flex items-center px-4 hidden md:flex">
              <Button
                variant="ghost"
                size="sm"
                iconName="LogOut"
                iconPosition="left"
                onClick={() => setShowLogoutConfirm(true)}
                className="text-red-600"
              >
                Sign Out
              </Button>
            </div>
          </div>

          {/* Tab Panels */}
          <div className="p-4 md:p-6">
            {/* Saved Schemes */}
            {activeTab === "saved" && (
              <div
                id="tabpanel-saved"
                role="tabpanel"
                aria-labelledby="tab-saved"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="text-base md:text-lg font-semibold"
                    style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-text-primary)" }}
                  >
                    Saved Schemes
                    {savedSchemes?.length > 0 && (
                      <span
                        className="ml-2 text-sm font-normal"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        ({savedSchemes?.length} schemes)
                      </span>
                    )}
                  </h2>
                  <Button
                    variant="default"
                    size="sm"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={handleStartQuiz}
                  >
                    Discover More
                  </Button>
                </div>
                <SavedSchemesSection
                  schemes={savedSchemes}
                  onViewDetails={handleViewDetails}
                  onRemoveBookmark={handleRemoveBookmark}
                />
              </div>
            )}

            {/* Quiz History */}
            {activeTab === "history" && (
              <div
                id="tabpanel-history"
                role="tabpanel"
                aria-labelledby="tab-history"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="text-base md:text-lg font-semibold"
                    style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-text-primary)" }}
                  >
                    Quiz History
                    {quizHistory?.length > 0 && (
                      <span
                        className="ml-2 text-sm font-normal"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        ({quizHistory?.length} attempts)
                      </span>
                    )}
                  </h2>
                  <Button
                    variant="default"
                    size="sm"
                    iconName="PlayCircle"
                    iconPosition="left"
                    onClick={handleStartQuiz}
                  >
                    New Quiz
                  </Button>
                </div>
                <QuizHistorySection
                  history={quizHistory}
                  onRetakeQuiz={handleRetakeQuiz}
                  onViewResults={handleViewResults}
                />
              </div>
            )}

            {/* Profile */}
            {activeTab === "profile" && (
              <div
                id="tabpanel-profile"
                role="tabpanel"
                aria-labelledby="tab-profile"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="text-base md:text-lg font-semibold"
                    style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-text-primary)" }}
                  >
                    My Profile
                  </h2>
                </div>
                <ProfileSection user={user} onUpdateProfile={handleUpdateProfile} />

                {/* Mobile logout */}
                <div
                  className="mt-8 pt-6 border-t md:hidden"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <Button
                    variant="destructive"
                    size="default"
                    iconName="LogOut"
                    iconPosition="left"
                    fullWidth
                    onClick={() => setShowLogoutConfirm(true)}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions - bottom */}
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
              <p
                className="text-sm font-semibold"
                style={{ fontFamily: "Poppins, sans-serif", color: "#9A3412" }}
              >
                Update your profile for better matches
              </p>
              <p className="text-xs" style={{ color: "#C2410C" }}>
                Accurate demographic details help us find more relevant schemes for you.
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
            Update Profile
          </Button>
        </div>

        {/* Footer */}
        <footer
          className="mt-8 text-center text-xs py-4"
          style={{ color: "var(--color-text-secondary)", fontFamily: "Nunito Sans, sans-serif" }}
        >
          <p>
            © {new Date()?.getFullYear()} YojanaSathi · Government of India · All scheme information is
            sourced from official government portals.
          </p>
        </footer>
      </main>
      {/* Logout Confirmation Modal */}
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
                  Sign Out
                </h3>
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  Are you sure you want to sign out?
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="default"
                fullWidth
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="default"
                fullWidth
                iconName="LogOut"
                iconPosition="left"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
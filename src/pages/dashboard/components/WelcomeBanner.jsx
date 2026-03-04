import React from "react";

import Icon from "components/AppIcon";
import Button from "components/ui/Button";

const WelcomeBanner = ({ user = {}, onStartQuiz }) => {
  const currentHour = new Date().getHours();

  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 17
      ? "Good Afternoon"
      : "Good Evening";

  const userName = user?.name || "Citizen";
  const savedCount = user?.savedCount ?? 0;
  const quizCount = user?.quizCount ?? 0;

  return (
    <div
      className="rounded-2xl p-6 md:p-8 text-white relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
        style={{ background: "#FFFFFF", transform: "translate(30%, -30%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10"
        style={{ background: "#FFFFFF", transform: "translate(-30%, 30%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        {/* Left Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0"
              style={{ background: "var(--color-accent)", color: "#FFFFFF" }}
              aria-hidden="true"
            >
              {userName.charAt(0).toUpperCase()}
            </div>

            <div>
              <p
                className="text-sm opacity-80"
                style={{ fontFamily: "Nunito Sans, sans-serif" }}
              >
                {greeting},
              </p>

              <h1
                className="text-xl md:text-2xl font-bold leading-tight truncate"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {userName}!
              </h1>
            </div>
          </div>

          <p className="text-sm md:text-base opacity-85 mt-2 max-w-lg">
            Discover government schemes you are eligible for. Take the eligibility
            quiz to find schemes tailored to your profile.
          </p>

          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-1.5 text-xs opacity-80">
              <Icon name="BookmarkCheck" size={14} />
              <span>{savedCount} Saved Schemes</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs opacity-80">
              <Icon name="ClipboardList" size={14} />
              <span>{quizCount} Quizzes Taken</span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-shrink-0">
          <Button
            variant="default"
            size="lg"
            iconName="PlayCircle"
            iconPosition="left"
            onClick={onStartQuiz}
            className="w-full lg:w-auto"
            style={{
              background: "var(--color-accent)",
              border: "none",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "1rem",
              padding: "14px 28px",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            Start Eligibility Quiz
          </Button>

          <p className="text-xs opacity-70 text-center mt-2">
            Takes only 2 minutes
          </p>
        </div>

      </div>
    </div>
  );
};

export default WelcomeBanner;
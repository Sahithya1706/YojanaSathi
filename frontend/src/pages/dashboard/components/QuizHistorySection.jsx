import React from "react";
import { format } from "date-fns";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";

const ANSWER_LABELS = {
  ageGroup: "Age Group",
  annualIncome: "Annual Income",
  householdIncome: "Household Income",
  occupation: "Occupation",
  employmentType: "Employment Type",
  educationLevel: "Education Level",
  category: "Category",
  gender: "Gender",
  state: "State",
  residenceType: "Residence",
  isFarmer: "Farmer",
};

const QuizHistorySection = ({ history, onRetakeQuiz, onViewResults }) => {
  if (!history || history?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--color-muted)" }}>
          <Icon name="ClipboardX" size={28} color="var(--color-muted-foreground)" />
        </div>
        <h3 className="text-base font-semibold mb-1" style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-text-primary)" }}>
          No Quiz History
        </h3>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Your quiz attempts will appear here once you take the eligibility quiz.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {history?.map((attempt) => {
        const answerEntries = Object.entries(attempt?.answers || {});
        const matchedNames = attempt?.matchedSchemeNames || [];
        const attemptDate = attempt?.date ? new Date(attempt.date) : null;
        const hasValidDate = attemptDate && !Number.isNaN(attemptDate.getTime());

        return (
          <div
            key={attempt?.id}
            className="rounded-xl border p-4 flex flex-col gap-4 transition-all duration-200 hover:shadow-md"
            style={{
              background: "var(--color-card)",
              borderColor: "var(--color-border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="flex flex-wrap items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--color-muted)" }}>
                <Icon name="ClipboardList" size={22} color="var(--color-primary)" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold" style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-text-primary)" }}>
                    Quiz Attempt #{attempt?.id}
                  </h4>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      background: "#F0FDF4",
                      color: "#166534",
                      border: "1px solid #BBF7D0",
                      fontFamily: "Nunito Sans, sans-serif",
                    }}
                  >
                    <Icon name="CheckCircle" size={11} color="#166534" />
                    {attempt?.matchedSchemes || 0} schemes matched
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  <span className="flex items-center gap-1">
                    <Icon name="Calendar" size={12} />
                    {hasValidDate ? format(attemptDate, "dd/MM/yyyy") : "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Clock" size={12} />
                    {hasValidDate ? format(attemptDate, "hh:mm a") : "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="User" size={12} />
                    Age {attempt?.age || "N/A"} | {attempt?.occupation || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="rounded-lg p-3" style={{ background: "var(--color-muted)", border: "1px solid var(--color-border)" }}>
                <p className="text-xs font-semibold mb-2" style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-text-primary)" }}>
                  User Answers
                </p>
                {answerEntries.length > 0 ? (
                  <div className="grid grid-cols-1 gap-1.5">
                    {answerEntries.slice(0, 6).map(([key, value]) => (
                      <p key={`${attempt?.id}-${key}`} className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                        <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>
                          {ANSWER_LABELS?.[key] || key}:
                        </span>{" "}
                        {String(value)}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    Income: {attempt?.income || "N/A"} | State: {attempt?.state || "N/A"}
                  </p>
                )}
              </div>

              <div className="rounded-lg p-3" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <p className="text-xs font-semibold mb-2" style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-text-primary)" }}>
                  Matched Schemes
                </p>
                {matchedNames?.length > 0 ? (
                  <ul className="list-disc pl-4 space-y-1">
                    {matchedNames.slice(0, 5).map((name) => (
                      <li key={`${attempt?.id}-${name}`} className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                        {name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    {attempt?.matchedSchemes || 0} schemes matched
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2 self-end">
              <Button variant="outline" size="sm" iconName="Eye" iconPosition="left" onClick={() => onViewResults(attempt?.id)}>
                Results
              </Button>
              <Button variant="default" size="sm" iconName="RefreshCw" iconPosition="left" onClick={onRetakeQuiz}>
                Retake
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuizHistorySection;

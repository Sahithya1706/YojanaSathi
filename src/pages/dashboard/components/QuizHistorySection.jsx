import React from "react";
import { format } from "date-fns";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";

const QuizHistorySection = ({ history, onRetakeQuiz, onViewResults }) => {
  if (!history || history?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: "var(--color-muted)" }}
        >
          <Icon name="ClipboardX" size={28} color="var(--color-muted-foreground)" />
        </div>
        <h3
          className="text-base font-semibold mb-1"
          style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-text-primary)" }}
        >
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
      {history?.map((attempt) => (
        <div
          key={attempt?.id}
          className="rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center gap-4 transition-all duration-200 hover:shadow-md"
          style={{
            background: "var(--color-card)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--color-muted)" }}
            aria-hidden="true"
          >
            <Icon name="ClipboardList" size={22} color="var(--color-primary)" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4
                className="text-sm font-semibold"
                style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-text-primary)" }}
              >
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
                {attempt?.matchedSchemes} schemes matched
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs" style={{ color: "var(--color-text-secondary)" }}>
              <span className="flex items-center gap-1">
                <Icon name="Calendar" size={12} />
                {format(new Date(attempt.date), "dd/MM/yyyy")}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="Clock" size={12} />
                {format(new Date(attempt.date), "hh:mm a")}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="User" size={12} />
                Age {attempt?.age} · {attempt?.occupation}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              iconName="Eye"
              iconPosition="left"
              onClick={() => onViewResults(attempt?.id)}
            >
              Results
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="RefreshCw"
              iconPosition="left"
              onClick={onRetakeQuiz}
            >
              Retake
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizHistorySection;
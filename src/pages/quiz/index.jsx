import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "components/ui/Header";
import AppFooter from "components/ui/AppFooter";
import Button from "components/ui/Button";
import { getCurrentUser, logout } from "utils/auth";
import { recommendSchemesFromAnswers } from "utils/aiRecommend";

const QUESTIONS = [
  { id: "age", label: "Age", type: "number", placeholder: "Enter your age" },
  { id: "income", label: "Annual Income (Rs)", type: "number", placeholder: "Enter annual income" },
  { id: "occupation", label: "Occupation", type: "choice", options: ["farmer", "student", "salaried", "self_employed", "daily_wage", "unemployed", "homemaker"] },
  { id: "category", label: "Category", type: "choice", options: ["general", "obc", "sc", "st", "ews"] },
  { id: "state", label: "State", type: "choice", options: ["maharashtra", "karnataka", "uttar_pradesh", "rajasthan", "bihar", "gujarat", "other"] },
  { id: "gender", label: "Gender", type: "choice", options: ["male", "female", "other"] },
  { id: "landOwnership", label: "Do you own agricultural land?", type: "choice", options: ["yes", "no"] },
  { id: "studentStatus", label: "Are you currently a student?", type: "choice", options: ["yes", "no"] },
  { id: "residenceType", label: "Residence Type", type: "choice", options: ["rural", "urban", "semi_urban"] },
  { id: "disabilityStatus", label: "Disability Status", type: "choice", options: ["yes", "no"] },
];

const pretty = (value) => String(value || "").replaceAll("_", " ");

const QuizPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(() => JSON.parse(localStorage.getItem("quizAnswersDraft") || "{}"));
  const [error, setError] = useState("");

  const currentQuestion = QUESTIONS[step];
  const selectedAnswer = answers[currentQuestion.id] ?? "";
  const progress = useMemo(() => Math.round(((step + 1) / QUESTIONS.length) * 100), [step]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const updateAnswer = (value) => {
    const updated = { ...answers, [currentQuestion.id]: value };
    setAnswers(updated);
    localStorage.setItem("quizAnswersDraft", JSON.stringify(updated));
    setError("");
  };

  const next = () => {
    if (selectedAnswer === "" || selectedAnswer == null) {
      setError("Please answer this question to continue.");
      return;
    }

    if (step + 1 < QUESTIONS.length) {
      setStep((value) => value + 1);
      return;
    }

    const submittedAt = new Date().toISOString();
    const quizAnswers = { ...answers, submittedAt };
    const { recommendations } = recommendSchemesFromAnswers(quizAnswers, { limit: 10 });

    const attempt = {
      id: Date.now(),
      date: submittedAt,
      userEmail: user?.email || "",
      userName: user?.name || "",
      answers: quizAnswers,
      matchedSchemes: recommendations.length,
      matchedSchemeNames: recommendations.map((scheme) => scheme.name),
      recommendations,
    };

    const history = JSON.parse(localStorage.getItem("quizHistory") || "[]");
    localStorage.setItem("quizHistory", JSON.stringify([attempt, ...history]));
    localStorage.setItem("quizAnswers", JSON.stringify(quizAnswers));
    localStorage.setItem("recentQuizResult", JSON.stringify(attempt));
    localStorage.setItem("recommendedSchemes", JSON.stringify(recommendations));
    localStorage.removeItem("quizAnswersDraft");
    navigate("/quiz/result");
  };

  const back = () => {
    if (step > 0) setStep((value) => value - 1);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      <Header isAuthenticated={!!user} user={user} onLogout={handleLogout} />
      <div className="main-content-offset" />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="rounded-2xl border bg-white p-6 md:p-8 shadow-sm">
          <div className="mb-5">
            <p className="text-sm font-medium text-slate-600 mb-2">
              Question {step + 1} of {QUESTIONS.length}
            </p>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full bg-blue-700 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="text-2xl font-bold mb-4">{currentQuestion.label}</h1>

              {currentQuestion.type === "number" && (
                <input
                  type="number"
                  value={selectedAnswer}
                  onChange={(event) => updateAnswer(event.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className="w-full border rounded-xl px-4 py-3 text-base"
                />
              )}

              {currentQuestion.type === "choice" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => updateAnswer(option)}
                      className="rounded-xl border px-4 py-3 text-left capitalize transition-all"
                      style={{
                        borderColor: selectedAnswer === option ? "#1d4ed8" : "#cbd5e1",
                        background: selectedAnswer === option ? "#eff6ff" : "#fff",
                      }}
                    >
                      <span className="text-sm font-medium">{pretty(option)}</span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

          <div className="flex items-center justify-between mt-6">
            <Button variant="outline" onClick={back} disabled={step === 0}>
              Back
            </Button>
            <Button onClick={next}>{step + 1 === QUESTIONS.length ? "Finish Quiz" : "Next"}</Button>
          </div>
        </div>
      </main>

      <AppFooter minimal />
    </div>
  );
};

export default QuizPage;

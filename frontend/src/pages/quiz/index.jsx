import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "components/ui/Header";
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

      <main className="min-h-[calc(100vh-76px)] flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-5xl min-h-[calc(100vh-120px)] rounded-3xl border bg-white p-6 md:p-10 shadow-sm flex flex-col">
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-sm md:text-base font-semibold text-slate-700">
                Question {step + 1} of {QUESTIONS.length}
              </p>
              <p className="text-sm font-medium text-slate-500">{progress}% complete</p>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-blue-700 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full flex flex-col items-center transition duration-300 ease-in-out"
              >
                <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-8 max-w-3xl">
                  {currentQuestion.label}
                </h1>

                {currentQuestion.type === "number" && (
                  <input
                    type="number"
                    value={selectedAnswer}
                    onChange={(event) => updateAnswer(event.target.value)}
                    placeholder={currentQuestion.placeholder}
                    className="w-full max-w-xl border border-slate-300 rounded-xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                )}

                {currentQuestion.type === "choice" && (
                  <div className="w-full flex flex-col items-center gap-3">
                    {currentQuestion.options.map((option) => {
                      const isSelected = selectedAnswer === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateAnswer(option)}
                          className={`w-full max-w-xl p-4 border rounded-xl text-left capitalize transition duration-300 ease-in-out hover:bg-blue-50 ${
                            isSelected
                              ? "border-blue-700 bg-blue-50 shadow-sm"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          <span className="text-base md:text-lg font-medium text-slate-800">{pretty(option)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="pt-4 border-t border-slate-200">
            {error && <p className="text-sm text-red-600 mb-3 text-center">{error}</p>}

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={back} disabled={step === 0}>
                Back
              </Button>
              <Button onClick={next}>{step + 1 === QUESTIONS.length ? "Finish Quiz" : "Next"}</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizPage;

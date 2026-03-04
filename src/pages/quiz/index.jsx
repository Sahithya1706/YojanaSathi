import React, { useState } from "react";
import Header from "components/ui/Header";
import Button from "components/ui/Button";

const QUESTIONS = [
  {
    id: 1,
    question: "What is your age group?",
    options: ["18-30", "31-45", "46-60", "60+"]
  },
  {
    id: 2,
    question: "What is your occupation?",
    options: ["Farmer", "Student", "Salaried", "Self Employed"]
  },
  {
    id: 3,
    question: "What is your annual income?",
    options: ["Below ₹1,00,000", "₹1L - ₹3L", "₹3L - ₹6L", "Above ₹6L"]
  },
  {
    id: 4,
    question: "What is your category?",
    options: ["General", "OBC", "SC", "ST"]
  },
  {
    id: 5,
    question: "Where do you live?",
    options: ["Rural", "Urban"]
  },
  {
    id: 6,
    question: "Do you own agricultural land?",
    options: ["Yes", "No"]
  }
];

const SCHEMES = [
  {
    name: "PM Kisan Samman Nidhi",
    benefit: "₹6000/year financial support for farmers"
  },
  {
    name: "Pradhan Mantri Fasal Bima Yojana",
    benefit: "Crop insurance for farmers"
  },
  {
    name: "Ayushman Bharat PM-JAY",
    benefit: "₹5,00,000 health insurance"
  },
  {
    name: "PM Mudra Yojana",
    benefit: "Loan up to ₹10 lakh for businesses"
  }
];

const QuizPage = () => {

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (option) => {

    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-background)" }}>

      <Header isAuthenticated={true} />

      <div
        style={{
          maxWidth: "700px",
          margin: "120px auto",
          padding: "30px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
        }}
      >

        {!showResult ? (
          <>
            <h2 style={{ fontSize: "26px", marginBottom: "20px" }}>
              Question {step + 1} of {QUESTIONS.length}
            </h2>

            <p style={{ fontSize: "18px", marginBottom: "25px" }}>
              {QUESTIONS[step].question}
            </p>

            <div style={{ display: "grid", gap: "12px" }}>
              {QUESTIONS[step].options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(option)}
                  style={{
                    padding: "14px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    cursor: "pointer",
                    fontSize: "16px",
                    background: "#f9fafb"
                  }}
                >
                  {option}
                </button>
              ))}
            </div>

            <div style={{ marginTop: "25px" }}>
              <div
                style={{
                  height: "6px",
                  background: "#eee",
                  borderRadius: "4px"
                }}
              >
                <div
                  style={{
                    width: `${((step + 1) / QUESTIONS.length) * 100}%`,
                    height: "100%",
                    background: "#2563eb",
                    borderRadius: "4px"
                  }}
                />
              </div>
            </div>

          </>
        ) : (

          <>
            <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>
              🎉 Schemes You Are Eligible For
            </h2>

            <div style={{ display: "grid", gap: "15px" }}>
              {SCHEMES.map((scheme, i) => (
                <div
                  key={i}
                  style={{
                    padding: "18px",
                    border: "1px solid #eee",
                    borderRadius: "10px",
                    background: "#f8fafc"
                  }}
                >
                  <h3 style={{ fontSize: "18px", fontWeight: "600" }}>
                    {scheme.name}
                  </h3>

                  <p style={{ fontSize: "14px", marginTop: "6px" }}>
                    {scheme.benefit}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "25px" }}>
              <Button
                onClick={() => window.location.href = "/dashboard"}
              >
                Go To Dashboard
              </Button>
            </div>

          </>
        )}

      </div>

    </div>
  );
};

export default QuizPage;
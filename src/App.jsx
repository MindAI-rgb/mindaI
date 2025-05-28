import React, { useState, useEffect } from "react";

const questions = [
  {
    question: "Which number logically completes the sequence: 2, 4, 8, 16, ?",
    options: ["18", "20", "32", "24"],
    answer: "32",
    ai: {
      correct: "Excellent logic! You've recognized the pattern of doubling.",
      incorrect: "Hmm... Think about how each number grows from the previous one. Try again!"
    }
  },
  {
    question: "What comes next: A, C, F, J, O, ?",
    options: ["Q", "U", "V", "W"],
    answer: "U",
    ai: {
      correct: "Well done! Each letter jumps forward one more place than the last.",
      incorrect: "Try thinking in terms of increasing intervals in the alphabet."
    }
  }
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [mentorMessage, setMentorMessage] = useState("");
  const [dateKey, setDateKey] = useState("");
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDateKey(today);
    const storedDate = localStorage.getItem("mindai_challenge_date");
    const storedStreak = parseInt(localStorage.getItem("mindai_streak"), 10) || 1;

    if (storedDate === today) {
      setStarted(true);
      setStep(questions.length);
      setFeedback("🎉 You've already completed today's challenge!");
      setMentorMessage(`Amazing! You're on a ${storedStreak}-day streak! Come back tomorrow for more.`);
      setStreak(storedStreak);
    } else if (storedDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (storedDate === yesterdayStr) {
        setStreak(storedStreak + 1);
        localStorage.setItem("mindai_streak", storedStreak + 1);
      } else {
        setStreak(1);
        localStorage.setItem("mindai_streak", "1");
      }
    } else {
      localStorage.setItem("mindai_streak", "1");
    }
  }, []);

  const checkAnswer = (option) => {
    setSelected(option);
    const isCorrect = option === questions[step].answer;
    setFeedback(isCorrect ? "✅ Correct!" : "❌ Try again.");
    setMentorMessage(isCorrect ? questions[step].ai.correct : questions[step].ai.incorrect);
    if (isCorrect) {
      setTimeout(() => {
        if (step + 1 < questions.length) {
          setStep(step + 1);
          setSelected(null);
          setFeedback("");
          setMentorMessage("");
        } else {
          setFeedback("🎉 You've completed today's challenges!");
          setMentorMessage(`🔥 You're on a ${streak}-day streak! Come back tomorrow for more.`);
          localStorage.setItem("mindai_challenge_date", dateKey);
        }
      }, 2000);
    }
  };

  const current = questions[step];

  return (
    <main>
      <h1>MindAI</h1>
      <p>🔥 Streak: {streak} day{streak > 1 ? "s" : ""}</p>
      {!started ? (
        <button onClick={() => setStarted(true)}>Start Today's Challenge</button>
      ) : step < questions.length ? (
        <div>
          <p>{current.question}</p>
          {current.options.map((option, i) => (
            <button key={i} onClick={() => checkAnswer(option)}>{option}</button>
          ))}
          <p>{feedback}</p>
          <p><i>{mentorMessage}</i></p>
        </div>
      ) : (
        <p>🎯 All daily challenges completed!</p>
      )}
    </main>
  );
}

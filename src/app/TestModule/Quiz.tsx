"use client"
import React, { useState, useEffect } from "react";
import { datamodule } from "@/utils/datamodule";
import { FaRegClock } from "react-icons/fa";
import "./Quiz.css";
import imagepiece from "@/images/Piecenoncnf.png";

type Language = 'fr' | 'ar';

const QuizModule = () => {
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [errorMessage, setErrorMessage] = useState("");
  const [answerSelected, setAnswerSelected] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<null | number>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [language, setLanguage] = useState<Language>('fr');

  const question = datamodule[language][currentQuestionIndex];

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setErrorMessage('Temps écoulé !');
    }
  }, [timeLeft]);

  const checkAns = (selectedOptionIndex: number) => {
    if (!lock) {
      setSelectedOptionIndex(selectedOptionIndex);
      setAnswerSelected(true);

      if (selectedOptionIndex === question.ans) {
        setScore(score + 1);
      }
      setLock(true);
    }
  };

  const next = () => {
    if (!answerSelected) {
      setErrorMessage('Veuillez choisir une réponse');
      return;
    }

    if (currentQuestionIndex < datamodule[language].length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(60);
      setLock(false);
      setAnswerSelected(false);
      setSelectedOptionIndex(null);
      setErrorMessage('');
    } else {
      setResult(true);
    }
  };

  const reset = () => {
    setScore(0);
    setResult(false);
    setTimeLeft(60);
    setErrorMessage("");
    setAnswerSelected(false);
    setSelectedOptionIndex(null);
    setCurrentQuestionIndex(0);
  };

  return (
    <div className="container">
      <h1>QCM Traitement non-conforme -Arrêt 1 er defaut </h1>
      <hr />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {result ? (
        <>
          <h2>
            Vous avez marqué {score} / {datamodule[language].length}
          </h2>
          <button onClick={reset}>Recommencer</button>
        </>
      ) : (
        question && (
          <>
            <h2>{question.question}</h2>
            <div className="timer-box">
              <div className="timer-container">
                <FaRegClock className="timer-icon" />
                <div className="timer-bar">
                  <div
                    className="timer-bar-inner"
                    style={{ width: `${(timeLeft / 60) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div
                className="timer"
                style={{ color: timeLeft < 10 ? "red" : "inherit" }}
              >
                Temps restant: {timeLeft} secondes
              </div>
            </div>

            <ul className="quiz-options">
              <li
                className={selectedOptionIndex === 0 ? "selected" : ""}
                onClick={() => checkAns(0)}
              >
                {question.option1}
              </li>
              <li
                className={selectedOptionIndex === 1 ? "selected" : ""}
                onClick={() => checkAns(1)}
              >
                {question.option2}
              </li>
              <li
                className={selectedOptionIndex === 2 ? "selected" : ""}
                onClick={() => checkAns(2)}
              >
                {question.option3}
              </li>
              <li
                className={selectedOptionIndex === 3 ? "selected" : ""}
                onClick={() => checkAns(3)}
              >
                {question.option4}
              </li>
              <li
                className={selectedOptionIndex === 4 ? "selected" : ""}
                onClick={() => checkAns(4)}
              >
                {question.option5}
              </li>
            </ul>

            <div className="index">
              {currentQuestionIndex + 1} sur {datamodule[language].length} questions
            </div>

            <button
              onClick={next}
              style={{
                width: "150px",
                height: "45px",
                background: "#110636",
                color: "#fff",
                fontSize: "18px",
                fontWeight: "500",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Next
            </button>
          </>
        )
      )}
    </div>
  );
};

export default QuizModule;

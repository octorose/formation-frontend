"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";  // Importer le composant Image
import { datasecurite } from "@/utils/datasecurite";
import { FaRegClock } from "react-icons/fa";
import "./Quiz.css";
import imagefleche from "@/images/fleche.png";
import imageintru from "@/images/intru1.png";
import imageintru2 from "@/images/intru2.png";
import imageintru3 from "@/images/intru3.png";
import imagesecurite from "@/images/securite1.png";
import imagesecurite2 from "@/images/securite2.png";

type Language = 'fr' | 'ar';

const QuizSecurite = () => {
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [errorMessage, setErrorMessage] = useState("");
  const [answerSelected, setAnswerSelected] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<null | number>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [language, setLanguage] = useState<Language>('fr');

  const question = datasecurite[language][currentQuestionIndex];

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

    if (currentQuestionIndex < datasecurite[language].length - 1) {
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
      <h1>QCM Traitement non-conforme -Arrêt 1er défaut</h1>
      <hr />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {result ? (
        <>
          <h2>
            Vous avez marqué {score} / {datasecurite[language].length}
          </h2>
          <button onClick={reset}>Recommencer</button>
        </>
      ) : (
        question && (
          <>
            <h2>{question.question}</h2>

            {/* Afficher l'image si l'index de la question est 0 */}
            {currentQuestionIndex === 0 && (
              <div className="image-container">
                <Image src={imagefleche} alt="Question Image" />
              </div>
            )}
             {currentQuestionIndex === 1 && (
              <div className="image-container">
                <Image src={imagefleche} alt="Question Image" />
              </div>
            )}
            {currentQuestionIndex === 2 && (
              <div className="image-container">
                <Image src={imageintru} alt="Question Image" />
              </div>
            )}
            {currentQuestionIndex === 3 && (
              <div className="image-container">
                <Image src={imageintru} alt="Question Image" />
              </div>
            )}
            {currentQuestionIndex === 4 && (
              <div className="image-container">
                <Image src={imageintru2} alt="Question Image" />
              </div>
            )}
            {currentQuestionIndex === 5 && (
              <div className="image-container">
                <Image src={imageintru3} alt="Question Image" />
              </div>
            )}
            {currentQuestionIndex === 6 && (
              <div className="image-container">
                <Image src={imagesecurite} alt="Question Image" />
              </div>
            )}
            {currentQuestionIndex === 7 && (
              <div className="image-container">
                <Image src={imagesecurite2} alt="Question Image" />
              </div>
            )}

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
              
              
              
            </ul>

            <div className="index">
              {currentQuestionIndex + 1} sur {datasecurite[language].length} questions
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

export default QuizSecurite;

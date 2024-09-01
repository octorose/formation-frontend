"use client";
import React, { useState, useEffect, useCallback } from "react";
import { data } from "@/utils/data";
import "./Quiz.css";
import { FaRegClock } from "react-icons/fa";
import LanguageToggle from "./LanguageToggle";
import Timer from "./Timer"; 
import Question from "./Question";
import Result from "./Result";
import { log } from "console";

const Quiz = () => {
  const [index, setIndex] = useState(0);
  const [checkedBoxes, setCheckedBoxes] = useState([0]);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(() => {
    return parseInt(localStorage.getItem("quizScore") || "0", 10);
  });
  const [result, setResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [errorMessage, setErrorMessage] = useState("");
  const [answerSelected, setAnswerSelected] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [language, setLanguage] = useState("fr");

  const questions = language === "fr" ? data.fr : data.ar;
  // console.log(questions);
  useEffect(() => {
    localStorage.setItem("quizIndex", index.toString());
    localStorage.setItem("quizScore", score.toString());
  }, [index, score]);

  useEffect(() => {
    if (index >= questions.length) {
      setResult(true);
    } else {
      setErrorMessage("");
    }
  }, [index, questions.length]);

  const nextQuestion = useCallback(() => {
    if (index < questions.length - 1) {
      setIndex((prev) => prev + 1);
      setTimeLeft(60);
      setAnswerSelected(false);
      setLock(false);
    } else {
      setResult(true);
    }
  }, [index, questions.length]);

  const checkAnswer = (selectedOptionIndex:any) => {
    if (!lock) {
      console.log("YES");
      
      setSelectedOptionIndex(selectedOptionIndex);
      setAnswerSelected(true);
      if (selectedOptionIndex === questions[index].ans) {
        setScore((prev) => prev + 1);
      }
      setLock(true);
      setTimeout(nextQuestion, 1000);
    }
  };

  const resetQuiz = () => {
    setIndex(0);
    setScore(0);
    setResult(false);
    setTimeLeft(60);
  };

  const handleLanguageToggle = () => {
    setLanguage((prev) => (prev === "fr" ? "ar" : "fr"));
  };

  return (
    <div className="container">
      <h1>Test Logique</h1>
      <div>
        <LanguageToggle
          language={language}
          toggleLanguage={handleLanguageToggle}
        />
        <Timer
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          onTimeOut={nextQuestion}
        />
      </div>
      <hr />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {result ? (
        <Result score={score} total={questions.length} onReset={resetQuiz} />
      ) : (
        <>
          <Question
            index={index}
            question={{
              id: questions[index].id,
              question: questions[index].question,
              options: questions[index].options,
              ans: questions[index].ans,
              image: questions[index].image,
            }}
            onAnswer={checkAnswer}
            selectedOptionIndex={selectedOptionIndex}
            answerSelected={answerSelected}
          />

          <div className="index">
            {index + 1} of {questions.length} questions
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;

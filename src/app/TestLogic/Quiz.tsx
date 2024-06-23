
"use client";
import React, { useState, useEffect } from "react";
import { data } from "@/utils/data";
import "./Quiz.css";
import { FaRegClock } from "react-icons/fa";
import image1 from "@/images/qst.png";
import dynamic from "next/dynamic";
import CheckboxGridQuestion from "./CheckboxGridQuestion";
import Image from "next/image";

const Quiz = () => {
  const [index, setIndex] = useState(0);
  const [checkedBoxes, setCheckedBoxes] = useState([0]);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [height, setHeight] = useState("");
  const [raison, setRaison] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [errorMessage, setErrorMessage] = useState("");
  const [answerSelected, setAnswerSelected] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<null | Number>(
    null
  );
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (index === data.length) {
      setResult(true);
      setErrorMessage(""); // Clear the error message when the result is shown
    }
  }, [index]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          next(); // Passer à la question suivante lorsque le temps est écoulé
          return 60; // Réinitialiser le temps
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [index, timeLeft]); // Ajoutez timeLeft comme dépendance supplémentaire

  useEffect(() => {
    if (index === data.length) {
      setResult(true);
      setErrorMessage(""); // Clear the error message when the result is shown
    }
  }, [index]);

  useEffect(() => {
    setHeight("");
    setLock(false);
    setAnswerSelected(false);
    setSelectedOptionIndex(null);
  }, [index]);

  const checkAns = (selectedOptionIndex: number) => {
    if (!lock) {
      setSelectedOptionIndex(selectedOptionIndex);
      setAnswerSelected(true);
      if (selectedOptionIndex === data[index].ans) {
        setScore(score + 1);
      }
      setLock(true);
      setTimeout(next, 1000);
    }
  };

  const next = () => {
    // Si aucune réponse n'est sélectionnée et que ce n'est pas la dernière question
    if (!answerSelected && data[index].ans !== -1 && index < data.length - 1) {
      setErrorMessage("Veuillez choisir une réponse");
      return;
    }

    // Si ce n'est pas la dernière question, passez à la question suivante
    if (index < data.length - 1) {
      setIndex(index + 1);
      setTimeLeft(60); // Réinitialiser le temps
      setAnswerSelected(false); // Réinitialiser l'état de la réponse sélectionnée
      setErrorMessage(""); // Effacer le message d'erreur
    } else {
      // Si c'est la dernière question, affichez le résultat
      setResult(true);
    }
  };

  const reset = () => {
    setIndex(0);
    setScore(0);
    setResult(false);
    setTimeLeft(60);
    setErrorMessage(""); // Réinitialiser errorMessage ici
  };

  const handleHeightChange = (e: any) => {
    const value = e.target.value;
    const number = parseFloat(value);
    if (!isNaN(number) && number >= 1.4 && number <= 2.1) {
      setHeight(value);
      setErrorMessage("");
    } else {
      setHeight(value);
      setErrorMessage(
        "Veuillez entrer une taille valide (entre 1.40 m et 2.10 m)"
      );
    }
  };

  const handleRaisonChange = (e: any) => {
    const value = e.target.value;
    const number = parseFloat(value);
    if (!isNaN(number) && number >= 1.4 && number <= 2.1) {
      setHeight(value);
      setErrorMessage("");
    } else {
      setHeight(value);
      setErrorMessage(
        "Veuillez entrer votre reponse valide (entre 1.40 m et 2.10 m)"
      );
    }
  };

  const toggleCheckbox = (index: number) => {
    if (checkedBoxes.includes(index)) {
      setCheckedBoxes(checkedBoxes.filter((item) => item !== index));
    } else {
      setCheckedBoxes([...checkedBoxes, index]);
    }
  };

  return (
    <div className="container">
      <h1>Test Logique</h1>
      <hr />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {result ? (
        <>
          <h2>
            You Scored {score} / {data.length}
          </h2>
          <button onClick={reset}>Reset</button>
        </>
      ) : (
        <>
          <h2>
            {index + 1}. {data[index].question}
          </h2>
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
              Time left: {timeLeft} seconds
            </div>
          </div>

          {index === 1 && ( // Afficher le rectangle bleu pour la question 2 (index 1)
            <div
              className="color-box"
              style={{
                backgroundColor: "blue",
                width: "100px",
                height: "100px",
                margin: "20px auto",
              }}
            ></div>
          )}
          {index === 2 && ( // Afficher le rectangle noir pour la question 3 (index 2)
            <div
              className="color-box"
              style={{
                backgroundColor: "black",
                width: "100px",
                height: "100px",
                margin: "20px auto",
              }}
            ></div>
          )}
          {index === 3 && ( // Afficher le rectangle rouge pour la question 4 (index 3)
            <div
              className="color-box"
              style={{
                backgroundColor: "red",
                width: "100px",
                height: "100px",
                margin: "20px auto",
              }}
            ></div>
          )}
          {index === 4 && ( // Afficher le rectangle rouge pour la question 5 (index 4)
            <div
              className="color-box"
              style={{
                backgroundColor: "blue",
                width: "100px",
                height: "100px",
                margin: "20px auto",
                opacity: "20",
              }}
            ></div>
          )}
          {index === 5 && ( // Afficher le rectangle rouge pour la question 6 (index 5)
            <div
              className="color-box"
              style={{
                backgroundColor: "yellow",
                width: "100px",
                height: "100px",
                margin: "20px auto",
              }}
            ></div>
          )}
          {index === 6 && ( // Afficher le rectangle bleu pour la question 7 (index 6)
            <div
              className="color-box"
              style={{
                backgroundColor: "blue",
                width: "100px",
                height: "100px",
                margin: "20px auto",
              }}
            ></div>
          )}
          {index === 7 && ( // Afficher le rectangle bleu pour la question 8 (index 7)
            <div
              className="color-box"
              style={{
                backgroundColor: "pink",
                width: "100px",
                height: "100px",
                margin: "20px auto",
              }}
            ></div>
          )}
          {index === 8 && ( // Afficher le rectangle bleu pour la question 9 (index 8)
            <div
              className="color-box"
              style={{
                backgroundColor: "orange",
                width: "100px",
                height: "100px",
                margin: "20px auto",
              }}
            ></div>
          )}
          {index === 9 && ( // Afficher le rectangle rouge pour la question 10 (index 9)
            <div
              className="color-box"
              style={{
                backgroundColor: "yellow",
                width: "100px",
                height: "100px",
                margin: "20px auto",
              }}
            ></div>
          )}
          {index === 10 && ( // Afficher le rectangle bleu pour la question 11 (index 10)
            <div
              className="color-box"
              style={{
                backgroundColor: "blue",
                width: "100px",
                height: "100px",
                margin: "20px auto",
              }}
            ></div>
          )}
          {index === 11 && ( // Afficher le rectangle bleu pour la question 12 (index 11)
            <div
              className="color-box"
              style={{
                backgroundColor: "green",
                width: "100px",
                height: "100px",
                margin: "20px auto",
              }}
            ></div>
          )}
          {index === 12 && ( // Afficher le rectangle bleu pour la question 13 (index 12)
            <div
              className="color-box"
              style={{
                backgroundColor: "black",
                width: "100px",
                height: "100px",
                margin: "20px auto",
              }}
            ></div>
          )}
          {index === 13 && ( // Afficher le rectangle bleu pour la question 14 (index 13)
            <div
              className="color-box"
              style={{
                backgroundColor: "pink",
                width: "100px",
                height: "100px",
                margin: "20px auto",
              }}
            ></div>
          )}
          {index === 14 && ( // Afficher le rectangle rouge pour la question 15 (index 14)
            <div
              className="color-box"
              style={{
                backgroundColor: "red",
                width: "100px",
                height: "100px",
                margin: "20px auto",
              }}
            ></div>
          )}
          {index === 15 && ( // Afficher le rectangle bleu pour la question 16 (index 15)
            <div
              className="color-box"
              style={{
                backgroundColor: "black",
                width: "100px",
                height: "100px",
                margin: "20px auto",
              }}
            ></div>
          )}
          {index === 16 && ( // Afficher le rectangle bleu pour la question 17 (index 16)
            <div
              className="color-box"
              style={{
                backgroundColor: "blue",
                width: "100px",
                height: "100px",
                margin: "20px auto",
              }}
            ></div>
          )}
          {index === 17 && ( // Afficher le rectangle bleu pour la question 18 (index 17)
            <div
              className="color-box"
              style={{
                backgroundColor: "blue",
                width: "100px",
                height: "100px",
                margin: "20px auto",
              }}
            ></div>
          )}
          {index === 18 && ( // Afficher le rectangle bleu pour la question 19 (index 18)
            <div
              className="color-box"
              style={{
                backgroundColor: "green",
                width: "100px",
                height: "100px",
                margin: "20px auto",
              }}
            ></div>
          )}
          {index === 19 && (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  backgroundColor: "blue",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "black",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "red",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "blue",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "yellow",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "blue",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "pink",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "orange",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "yellow",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <br />
              <div
                style={{
                  backgroundColor: "blue",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "green",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "black",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "pink",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "red",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "black",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "blue",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "blue",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "green",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
            </div>
          )}
          {index === 20 && (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  backgroundColor: "blue",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "black",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "red",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "blue",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "yellow",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "blue",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "pink",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "orange",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "yellow",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <br />
              <div
                style={{
                  backgroundColor: "blue",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "green",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "black",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "pink",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "red",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "black",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "blue",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "blue",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "green",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
            </div>
          )}

          {index === 21 && (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  backgroundColor: "blue",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "black",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "red",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "blue",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "yellow",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "blue",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "pink",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "orange",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "yellow",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <br />
              <div
                style={{
                  backgroundColor: "blue",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "green",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "black",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "pink",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "red",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "black",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "blue",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "blue",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "green",
                  display: "inline-block",
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                }}
              ></div>
            </div>
          )}
          {index === 22 && (
            <div className="image-container">
              <Image src={image1} alt="Question Image" />
            </div>
          )}
          {index === 23 && (
            <div className="image-container">
              <img src="/image/qst33.PNG" alt="Question Image " />
            </div>
          )}
          {index === 24 && (
            <div className="image-container">
              <img src="/image/qst44.PNG" alt="Question Image " />
            </div>
          )}
          {index === 25 && (
            <div className="image-container">
              <img src="/image/qst55.PNG" alt="Question Image " />
            </div>
          )}
          {index === 26 && (
            <div className="image-container">
              <img src="/image/qst66.PNG" alt="Question Image " />
            </div>
          )}
          {index === 27 && (
            <div className="image-container">
              <img src="/image/qst77.PNG" alt="Question Image " />
            </div>
          )}
          {index === 28 && (
            <div className="image-container">
              <img src="/image/qst88.PNG" alt="Question Image " />
            </div>
          )}
          {index === 29 && (
            <div className="image-container">
              <img src="/image/qst99.PNG" alt="Question Image " />
            </div>
          )}
          {index === 30 && (
            <div className="question-container">
              <textarea
                rows={4}
                cols={50}
                value={raison}
                onChange={handleRaisonChange}
                placeholder="Entrez votre réponse ici..."
                style={{
                  padding: "10px",
                  fontSize: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  marginBottom: "10px",
                }}
              />
              <button
                onClick={() => {
                  next();
                  console.log("hh");
                }}
              >
                Next
              </button>
            </div>
          )}
          {index === 31 && (
            <div className="question-container">
              <textarea
                rows={4}
                cols={50}
                value={raison}
                onChange={handleRaisonChange}
                placeholder="Entrez votre réponse ici..."
                style={{
                  padding: "10px",
                  fontSize: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  marginBottom: "10px",
                }}
              />
            </div>
          )}

          {index === 32 && (
            <div className="question-container">
              <h3>Cochez le maximum de cercles en 30 secondes :</h3>

              <div className="checkbox-grid">
                {/* Boucle pour générer les 200 cases à cocher */}
                {[...Array(200)].map((_, index) => (
                  <label key={index} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={checkedBoxes.includes(index)}
                      onChange={() => toggleCheckbox(index)}
                      className="checkbox-input"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {data[index].ans === -1 ? (
            <div className="quiz-input-container">
              <input
                type="text"
                placeholder="Enter your height in m"
                value={height}
                onChange={handleHeightChange}
                style={{
                  height: "25px",
                  width: "800px",
                  padding: "5px",
                  fontSize: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              />
              <br />
              <br />
              <button
                disabled={!!height || !!errorMessage}
                onClick={next}
                style={{
                  display: "block",
                  margin: "0 auto",
                }}
              >
                Next
              </button>
            </div>
          ) : data[index].id >= 30 ? (<></>) :(
            <div>
              <ul className="quiz-options">
                <li
                  className={selectedOptionIndex === 0 ? "selected" : ""}
                  onClick={() => checkAns(0)}
                >
                  {data[index].option1}
                </li>
                <li
                  className={selectedOptionIndex === 1 ? "selected" : ""}
                  onClick={() => checkAns(1)}
                >
                  {data[index].option2}
                </li>
                <li
                  className={selectedOptionIndex === 2 ? "selected" : ""}
                  onClick={() => checkAns(2)}
                >
                  {data[index].option3}
                </li>
                <li
                  className={selectedOptionIndex === 3 ? "selected" : ""}
                  onClick={() => checkAns(3)}
                >
                  {data[index].option4}
                </li>
                <li
                  className={selectedOptionIndex === 4 ? "selected" : ""}
                  onClick={() => checkAns(4)}
                >
                  {data[index].option5}
                </li>
              </ul>
              <button onClick={next}>Next</button>
            </div>
          )}
          <div className="index">
            {index + 1} of {data.length} questions
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;

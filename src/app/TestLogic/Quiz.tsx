"use client";
import React, { useState, useEffect } from "react";
import { data } from "@/utils/data";
import "./Quiz.css";
import { FaRegClock } from "react-icons/fa";
import image2 from "@/images/Qst22.png";
import image3 from "@/images/qst33.png";
import image4 from "@/images/qst44.png";
import image5 from "@/images/qst55.png";
import image6 from "@/images/qst66.png";
import image7 from "@/images/qst77.png";
import image8 from "@/images/qst88.png";
import image9 from "@/images/qst99.png";
import dynamic from "next/dynamic";
import CheckboxGridQuestion from "./CheckboxGridQuestion";
import Image from "next/image";

const Quiz = () => {
  const [index, setIndex] = useState(() => {
    const savedIndex = localStorage.getItem('quizIndex');
    return savedIndex !== null ? parseInt(savedIndex, 10) : 0;
  });

  const [checkedBoxes, setCheckedBoxes] = useState([0]);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem('quizScore');
    return savedScore !== null ? parseInt(savedScore, 10) : 0;
  });
  const [result, setResult] = useState(false);
  const [height, setHeight] = useState("");
  const [raison, setRaison] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [errorMessage, setErrorMessage] = useState("");
  const [answerSelected, setAnswerSelected] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<null | number>(null);
  const [userAnswers, setUserAnswers] = useState([]);


  useEffect(() => {
    // Sauvegarder l'index et le score dans localStorage à chaque changement
    localStorage.setItem('quizIndex', index.toString());
    localStorage.setItem('quizScore', score.toString());
  }, [index, score]);

  useEffect(() => {
    // Gérer le déroulement du quiz et la fin du quiz
    if (index === data.length) {
      setResult(true);
    } else {
      setErrorMessage(""); // Réinitialiser le message d'erreur si on affiche une nouvelle question
    }
  }, [index]);

  useEffect(() => {
    // Timer pour le quiz
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          next(); // Appeler next() lorsque le temps est écoulé
        }
        return prevTime - 1;
      });
    }, 1000);
  
    // Nettoyer le timer lorsque le composant est démonté ou lorsque le timer n'est plus nécessaire
    return () => clearInterval(timer);
  }, [index]);

  const checkAns = (selectedOptionIndex: number) => {
    if (!lock) {
      setSelectedOptionIndex(selectedOptionIndex);
      setAnswerSelected(true);

      
      if (selectedOptionIndex === data[index].ans) {
        setScore((prevScore) => prevScore + 1);
      }
      setLock(true);
      setTimeout(next, 1000);
    }
  };

  const next = () => {
    // Vérifier si la question actuelle nécessite une réponse
    if (index === 30 && raison.trim() === "") {
        setErrorMessage('Veuillez entrer une réponse');
        return;
    }
    if (index === 31 && raison.trim() === "") {
      setErrorMessage('Veuillez entrer une réponse');
      return;
  }

    // Si ce n'est pas la dernière question, passer à la question suivante
    if (index < data.length - 1) {
        setIndex(index + 1);
        setTimeLeft(60); // Réinitialiser le temps
        setAnswerSelected(false); // Réinitialiser l'état de la réponse sélectionnée
        setHeight(""); // Réinitialiser l'état de la réponse texte si nécessaire
        setRaison(""); // Réinitialiser l'état de la réponse textuelle
        setLock(false); // Assurez-vous que `lock` est réinitialisé si nécessaire
        setErrorMessage(''); // Effacer le message d'erreur
    } else {
        // Si c'est la dernière question, afficher le résultat
        setResult(true);
    }
};




  const reset = () => {
    // Réinitialiser toutes les valeurs au début du quiz
    setIndex(0);
    setScore(0);
    setResult(false);
    setTimeLeft(60);
    setErrorMessage(""); // Réinitialiser errorMessage ici
  };

  const handleHeightChange = (e:any) => {
    const value = e.target.value;
    const number = parseFloat(value);
    if (!isNaN(number) && number >= 1.40 && number <= 2.10) {
        setHeight(value);
        setErrorMessage('');
    } else {
        setHeight(value);
        setErrorMessage('Veuillez entrer une taille valide (entre 1.40 m et 2.10 m)');
    }
}


  const handleRaisonChange = (e:any) => {
    const value = e.target.value;
    setRaison(value); // Met à jour la valeur dans le state
    setErrorMessage("Veuillez repondre"); // Efface tout message d'erreur précédent
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
              <Image src={image2} alt="Question Image" />
            </div>
          )}
          {index === 23 && (
            <div className="image-container">
              <Image src={image3} alt="Question Image " />
            </div>
          )}
          {index === 24 && (
            <div className="image-container">
              <Image src={image4} alt="Question Image " />
            </div>
          )}
          {index === 25 && (
            <div className="image-container">
              <Image src={image5} alt="Question Image " />
            </div>
          )}
          {index === 26 && (
            <div className="image-container">
              <Image src={image6} alt="Question Image " />
            </div>
          )}
          {index === 27 && (
            <div className="image-container">
              <Image src={image7} alt="Question Image " />
            </div>
          )}
          {index === 28 && (
            <div className="image-container">
              <Image src={image8} alt="Question Image " />
            </div>
          )}
          {index === 29 && (
            <div className="image-container">
              <Image src={image9} alt="Question Image " />
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

          {index === 32 && (
            <div className="question-container">
              <h3>Cochez le maximum de cercles  :</h3>

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
                <button onClick={next}>Next</button>
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
                  width: "500px",
                  padding: "15px",
                  fontSize: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  textAlign:"center",
                  display: "flex",
                }}
              />
              <br />
              <br />
              <button
                disabled={!height || !!errorMessage}
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
              
              <button 
              onClick={next}
              disabled={selectedOptionIndex === null}
              >
                Next
              </button>
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
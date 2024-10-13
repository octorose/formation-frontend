import Image, { StaticImageData } from "next/image";
import qst22 from "@/images/qst22.png";
import qst33 from "@/images/qst33.png";
import qst44 from "@/images/qst44.png";
import qst55 from "@/images/qst55.png";
import qst66 from "@/images/qst66.png";
import qst77 from "@/images/qst77.png";
import qst88 from "@/images/qst88.png";
import qst99 from "@/images/qst99.png";


// Define the types for the props
interface QuestionProps {
  index: number;
  question: {
    id: number;
    question: string;
    options?: string[];
    ans: number;
    image?: string;
  };
  onAnswer: (idx: number) => void;
  selectedOptionIndex: number | null;
  answerSelected: boolean;
}

// Image map with specific keys
const imageMap: { [key: number]: StaticImageData } = {
  23: qst22,
  24: qst33,
  25: qst44,
  26: qst55,
  27: qst66,
  28: qst77,
  29: qst88,
  30: qst99,
};

const Question= ({
  index,
  question,
  onAnswer,
  selectedOptionIndex,
  answerSelected,
}:any) => {
  // Render a color box based on the answer
  const renderColorBox = () => {
    if (question && question.options) {
      const colors: { [key: string]: string } = {
        Vert: "green",
        Rouge: "red",
        Bleu: "blue",
        Jaune: "yellow",
        Autre: "gray",
        أخضر: "green",
        أحمر: "red",
        أزرق: "blue",
        أصفر: "yellow",
        آخر: "gray",
      };

      const color = colors[question.options[question.ans]];
      return (
        <div
          style={{
            backgroundColor: color,
            width: "100px",
            height: "100px",
            margin: "20px auto",
          }}
        ></div>
      );
    }
    return null;
  };

  return (
    <div>
      <h2>
        {index + 1}. {question.question}
      </h2>
      {imageMap[question.id] ? (
        <Image
          src={imageMap[question.id]}
          alt={question.question}
          width={200}
          height={200}
        />
      ) : (
        renderColorBox()
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
      {index === 0 && <input type="text" placeholder="Réponse" className=" border-2 border-gray-300 p-2 rounded-md w-full" />}
      <ul className="quiz-options">
        {question?.options?.map((option: any, idx: any) => (
          <li
            key={idx}
            className={selectedOptionIndex === idx ? "selected" : ""}
            onClick={() => onAnswer(idx)}
          >
            {option}
          </li>
        ))}
      </ul>
      <button onClick={onAnswer} disabled={!answerSelected}>
        Next
      </button>
    </div>
  );
};

export default Question;

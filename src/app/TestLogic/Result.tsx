import { postWithAuth } from "@/utils/api";
import { getRoleIdFromToken } from "@/utils/getRoleIdFromToken";
import { send } from "process";
import { use, useEffect } from "react";

const Result = ({ score, total, onReset }:any) => {

  const sendResult = async () => {
    try {
      const response = await postWithAuth(`api/tests/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type_test: "TestLogic",
          noteTest:score,
          date_test: new Date(),
          personnel: getRoleIdFromToken(),
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Quelque chose s'est mal passé");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  }

  useEffect(() => {
    sendResult();
  }, []);
  return (
    <>
      <h2>
        You Scored {score} / {total}
      </h2>
      {/* <button onClick={onReset}>Reset</button> */}
    </>
  );
};

export default Result;

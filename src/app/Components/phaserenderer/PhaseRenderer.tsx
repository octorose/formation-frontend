import { EditIcon } from "lucide-react";
import React from "react";

function PhaseRenderer({
  fields,
  editMode,
  CandidatetoEdit,
  setCandidatetoEdit,
  handleEdit,
}: any) {
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: string
  ) => {
    const { value } = event.target;

    setCandidatetoEdit((prevCandidatetoEdit: any) => {
      if (
        key === "ligne" ||
        key === "etat" ||
        key === "contract" ||
        key === "isAffecteur"
      ) {
        const updatedValue =
          key === "isAffecteur" ? (value === "Oui" ? true : false) : value;

        return {
          ...prevCandidatetoEdit,
          [key]: updatedValue,
        };
      } else {
        // Construct the new agent object without modifying the key directly
        const updatedAgent = {
          ...prevCandidatetoEdit.agent,
          [key]: value,
        };

        // Return the updated candidate object with the updated agent
        return {
          ...prevCandidatetoEdit,
          agent: updatedAgent,
        };
      }
    });
  };

  function flattenData(data: any) {
    const { agent, ...rest } = data;
    return { ...agent, ...rest };
  }

  return (
    <div className="grid grid-cols-2 gap-5 p-4">
      {Object.keys(fields).map((key, index) => (
        <div key={index} className="text-slate-900">
          <div>
            <h2 className="font-semibold">{key}</h2>
            {editMode[index] && key === "etat" ? (
              <select
                value={flattenData(CandidatetoEdit)[key]}
                onChange={(e: any) => handleInputChange(e, key)}
                className="w-full"
              >
                <option value="En Formation">En Formation</option>
                <option value="Candidat">Candidat</option>
              </select>
            ) : editMode[index] && key === "isAffecteur" ? (
              <select
                value={CandidatetoEdit.isAffecteur ? "Oui" : "Non"}
                onChange={(e: any) => handleInputChange(e, key)}
                className="w-full"
              >
                <option value="Oui">Oui</option>
                <option value="Non">Non</option>
              </select>
            ) : editMode[index] ? (
              <input
                type="text"
                value={flattenData(CandidatetoEdit)[key]}
                onChange={(e) => handleInputChange(e, key)}
                className="w-full"
              />
            ) : (
              <div className="flex flex-row items-center text-black justify-between">
                <h2>
                  {flattenData(CandidatetoEdit)[key]?.toString().length > 10
                    ? flattenData(CandidatetoEdit)[key].toString().slice(0, 6) +
                      "..."
                    : flattenData(CandidatetoEdit)[key]}
                  {CandidatetoEdit[key] === true
                    ? "Oui"
                    : CandidatetoEdit[key] === false
                    ? "Non"
                    : CandidatetoEdit[key]}
                </h2>
                <EditIcon
                  className="w-6 h-6"
                  onClick={() => handleEdit(index, key)}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PhaseRenderer;

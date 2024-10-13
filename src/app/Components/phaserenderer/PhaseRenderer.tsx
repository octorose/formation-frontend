import { EditIcon } from "lucide-react";
import React from "react";
import MultiSelectDropDown from "../MultiSelectDropDown/MultiSelectDropDown";
import Supervisors from '../SupervisorsCard/Supervisors';
import { Agent } from '../../interfaces/Agent';

interface Lignes {
  id: number;
  name: string;
}
interface Supervisors {
  id: number;
  agent: Agent;
  
}
interface Ligne {
  id: number;
  name: string;
}
interface PhaseRendererProps {
  fields: any;
  editMode: boolean[];
  CandidatetoEdit: any;
  setCandidatetoEdit: (value: any) => void;
  handleEdit: (index: number, key: string) => void;
  lignes?: Lignes[] | null;
  ligne?: Ligne | null;
  Supervisors?: Supervisors[] | null;
}

function PhaseRenderer({
  fields,
  editMode,
  CandidatetoEdit,
  setCandidatetoEdit,
  handleEdit,
  lignes,
  ligne,
  Supervisors,
}: PhaseRendererProps) {
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
        key === "isAffecteur"||
        key === "superviseur_nom" ||
        key === "name"
      ) {
        console.log(CandidatetoEdit);
        const updatedValue =
          key === "isAffecteur" ? (value === "Oui" ? true : false) : value;
        
        return {
          ...prevCandidatetoEdit,
          [key]: updatedValue,
        };
      } else {
        const updatedAgent = {
          ...prevCandidatetoEdit.agent,
          [key]: value,
        };

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
    <div className="grid grid-cols-2 gap-5 p-4 overflow-hidden">
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
            ) : editMode[index] && key === "lignes" && lignes ? (
              <MultiSelectDropDown
                options={lignes || []} // Ensure options are defined
                formFieldName="ligne"
                selected={CandidatetoEdit.lignes.map((item: any) => item.id)}
                onChange={(selectedIds: number[]) =>
                  setCandidatetoEdit((prevCandidatetoEdit: any) => ({
                    ...prevCandidatetoEdit,
                    lignes: selectedIds,
                  }))
                }
              />
            ) : editMode[index] && key === "superviseur_nom" && Supervisors ? (
              <select
                value={flattenData(CandidatetoEdit)["id"]}
                onChange={(e: any) => handleInputChange(e, key)}
                className="w-full"
              >
                {Supervisors.map((supervisor) => (
                  <option key={supervisor.id} value={supervisor.id}>
                    {supervisor.agent.nom}
                  </option>
                ))}
              </select>
            ) : editMode[index] && key === "ligne" ? (
              <select
                value={flattenData(CandidatetoEdit)["ligne"]}
                onChange={(e: any) => handleInputChange(e, key)}
                className="w-full"
              >
                {lignes?.map((supervisor) => (
                  <option key={supervisor.id} value={supervisor.id}>
                    {supervisor.name}
                  </option>
                ))}
              </select>
            ) : // <input
            //   type="text"
            //   value={flattenData(CandidatetoEdit)[key]}
            //   onChange={(e) => handleInputChange(e, key)}
            //   className="w-full"
            // />
            editMode[index] ? (
              <div>
                <p>{key}</p>
                <input
                  type="text"
                  value={flattenData(CandidatetoEdit)[key]}
                  onChange={(e) => handleInputChange(e, key)}
                  className="w-full"
                />
              </div>
            ) : (
              <div className="flex flex-row items-center text-black justify-between">
                {key === "lignes" ? (
                  <div>clic pour modifier</div>
                ) : (
                  <h2>
                    {flattenData(CandidatetoEdit)[key]?.toString().length > 10
                      ? flattenData(CandidatetoEdit)
                          [key].toString()
                          .slice(0, 6) + "..."
                      : flattenData(CandidatetoEdit)[key]}
                    {CandidatetoEdit[key] === true
                      ? "Oui"
                      : CandidatetoEdit[key] === false
                      ? "Non"
                      : ""}
                  </h2>
                )}
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

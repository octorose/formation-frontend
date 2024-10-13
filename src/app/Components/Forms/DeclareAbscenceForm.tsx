'use client'
import React, { useState, useEffect } from "react";
import { fetchWithAuth, postWithAuth } from "@/utils/api";
import Swal from "sweetalert2";
import { getRoleIdFromToken } from "@/utils/getRoleIdFromToken";
import { getRoleFromToken } from "@/utils/getRoleFromToken";

interface Operator {
  id: number;
  agent: {
    nom: string;
    prenom: string;
  };
  ligne: {
    id: number;
    name: string;
  };
}

function DeclareAbsenceForm() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<number | null>(null);
  const [date, setDate] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    try {
      if (getRoleFromToken() == "Superviseur") {
        const response = await fetchWithAuth(`api/supervisor-operators/${getRoleIdFromToken()}/`);
        console.log(response);
        setOperators(response);
      } else {
        const response = await fetchWithAuth("api/operators/");
        setOperators(response.results);
      }
    } catch (error) {
      console.error("Failed to fetch operators", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOperator || !date || !reason) {
      Swal.fire("Error", "Please fill all fields", "error");
      return;
    }

    try {
      await postWithAuth("api/declare-absence/", {
        personnel: selectedOperator,
        formateur: getRoleFromToken() == "Superviseur" ? 6 : getRoleIdFromToken(),
        date,
        reason,
      });
      Swal.fire("Success", "Absence declared successfully", "success");
      setSelectedOperator(null);
      setDate("");
      setReason("");
    } catch (error) {
      console.error("Failed to declare absence", error);
      Swal.fire("Error", "Failed to declare absence", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="operator"
          className="block text-sm font-medium text-gray-700"
        >
          Select Operator
        </label>
        <select
          id="operator"
          value={selectedOperator || ""}
          onChange={(e) => setSelectedOperator(Number(e.target.value))}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Select an operator</option>
          {operators.map((operator) => (
            <option key={operator.id} value={operator.id}>
              {operator.agent.nom} {operator.agent.prenom} -{" "}
              {operator.ligne.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="reason"
          className="block text-sm font-medium text-gray-700"
        >
          Reason
        </label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter reason for absence"
        ></textarea>
      </div>
      <div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Declare Absence
        </button>
      </div>
    </form>
  );
}

export default DeclareAbsenceForm;

"use client";
import React, { useState, useEffect } from "react";
import { Button, Input } from "@headlessui/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Loader from "../common/Loader";
import { fetchWithAuth } from "@/utils/api";
import { getRoleIdFromToken } from "@/utils/getRoleIdFromToken";
import { Agent } from "@/interfaces/Agent";
import Image from "next/image";
import { Poste } from "@/interfaces/Poste";

interface ScoreGridProps {
  score: number;
}
interface Employee {
  id: string;
  agent: Agent;
  etat: string;
  ligne: number;
  poste: Poste;
}
interface ProductionLine {
  id: string;
  name: string;
}
interface RatedEmployee extends Employee {
  score: number;
}

export default function Polyvalance() {
  const [ratedOperateurs, setRatedOperateurs] = useState<RatedEmployee[]>([]);
  const [unratedOperateurs, setUnratedOperateurs] = useState<Employee[]>([]);
  const [productionLines, setProductionLines] = useState<ProductionLine[]>([]);
  const [productionLine, setProductionLine] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [ratedLoading, setRatedLoading] = useState(true);
  const [unratedLoading, setUnratedLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (productionLine) {
      fetchRatedOperateurs();
      fetchUnratedOperateurs();
    }
  }, [productionLine]);

  useEffect(() => {
    fetchLignes();
  }, []);

  const fetchRatedOperateurs = async () => {
    setRatedLoading(true);
    setError("");
    try { 
      const response = await fetchWithAuth(
        `/api/rated-operators/${productionLine}/`
      );
      setRatedOperateurs(response);
    } catch (error: any) {
      setError(error.message);
      setRatedOperateurs([]);
    } finally {
      setRatedLoading(false);
    }
  };

  const fetchLignes = async () => {
    setRatedLoading(true);
    setError("");
    try {
      const response = await fetchWithAuth(
        `api/supervisor-lignes/${getRoleIdFromToken()}/`
      );
      setProductionLines(response.results);
      if (response.results.length > 0) {
        setProductionLine(response.results[0].id);
      }
    } catch (error: any) {
      setError(error.message);
      setRatedOperateurs([]);
    } finally {
      setRatedLoading(false);
    }
  };

  const fetchUnratedOperateurs = async () => {
    setUnratedLoading(true);
    setError("");
    try {
      const response = await fetchWithAuth(
        `api/unrated-operators/${productionLine}/`
      );
      setUnratedOperateurs(response);
    } catch (error: any) {
      setError(error.message);
      setUnratedOperateurs([]);
    } finally {
      setUnratedLoading(false);
    }
  };

  const handleLineChange = async (value: string) => {
    setProductionLine(value);
    setRatedOperateurs([]); // Clear the rated operators
    setUnratedOperateurs([]); // Clear the unrated operators
    fetchRatedOperateurs();
    fetchUnratedOperateurs();
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 w-full">
      <div className="bg-background rounded-lg shadow-md bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Rated Operateurs</h2>
            <p className="text-muted-foreground">
              Review & rate the performance of operateurs on your production
              line.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="production-line">Line</label>
            <Select
              defaultValue=""
              onValueChange={(value) => handleLineChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select production line" />
              </SelectTrigger>
              <SelectContent>
                {productionLines.map((line: any) => (
                  <SelectItem key={line.id} value={line.id}>
                    {line.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 max-h-[300px] overflow-auto">
          {productionLine ? (
            ratedLoading ? (
              <Loader />
            ) : error ? (
              <p>{error}</p>
            ) : ratedOperateurs.length === 0 ? (
              <p>No rated operateurs found. Rate operateurs to see them here</p>
            ) : (
              ratedOperateurs.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center  rounded-md text-black"
                >
                  <div className="flex  w-full items-center gap-3 ">
                    <span className=" rounded-full">
                      <Image
                        width={20}
                        height={20}
                        src={
                          "https://ui-avatars.com/api/?name=" +
                          employee.agent.nom +
                          "i&size=160&background=random"
                        }
                        style={{
                          width: "auto",
                          height: "auto",
                          borderRadius: "50%",
                        }}
                        alt="User"
                      />
                    </span>
                    <div className="font-medium">{employee.agent.nom}</div>
                    <div>{employee.poste.name}</div>
                    <div>
                     
                      <ScoreGrid
                        score={employee.score > 4 ? 4 : employee.score}
                      />
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            <p>Please choose a Production Line</p>
          )}
        </div>
      </div>
      <div className="bg-background rounded-lg bg-white shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Unrated Operateurs</h2>
            <p className="text-muted-foreground">
              Review and rate the performance of operateurs on your production
              line.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search operateurs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button>
              <SearchIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="grid gap-4 max-h-[300px] overflow-auto">
          {productionLine ? (
            unratedLoading ? (
              <Loader />
            ) : error ? (
              <p>{error}</p>
            ) : unratedOperateurs.length === 0 ? (
              <p>No unrated operateurs found. Everything is updated</p>
            ) : (
              unratedOperateurs
                .filter((employee) =>
                  employee.agent.nom.toLowerCase().includes(searchQuery)
                )
                .map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center rounded-md text-black"
                  >
                    <div
                      className="flex w-full items-center gap-3"
                      onClick={() => console.log(unratedOperateurs)}
                    >
                      <span className="rounded-full">
                        <Image
                          width={20}
                          height={20}
                          src={
                            "https://ui-avatars.com/api/?name=" +
                            employee.agent.nom +
                            "i&size=160&background=random"
                          }
                          style={{
                            width: "auto",
                            height: "auto",
                            borderRadius: "50%",
                          }}
                          alt="User"
                        />
                      </span>
                      <div className="font-medium">{employee.agent.nom}</div>
                      <div>{employee.poste.name}</div>
                    </div>
                  </div>
                ))
            )
          ) : (
            <p>Please choose a Production Line</p>
          )}
        </div>
      </div>
    </div>
  );
}
const ScoreGrid: React.FC<ScoreGridProps> = ({ score }) => {
  const grids: { [key: number]: string[] } = {
    1: [
      "bg-blue-500",
      "bg-white",
      "bg-white",
      "bg-blue-500",
      "bg-white",
      "bg-white",
      "bg-blue-500",
      "bg-white",
      "bg-white",
    ],
    2: [
      "bg-blue-500",
      "bg-white",
      "bg-white",
      "bg-blue-500",
      "bg-white",
      "bg-white",
      "bg-blue-500",
      "bg-blue-500",
      "bg-blue-500",
    ],
    3: [
      "bg-blue-500",
      "bg-white",
      "bg-blue-500",
      "bg-blue-500",
      "bg-white",
      "bg-blue-500",
      "bg-blue-500",
      "bg-blue-500",
      "bg-blue-500",
    ],
    4: [
      "bg-blue-500",
      "bg-blue-500",
      "bg-blue-500",
      "bg-blue-500",
      "bg-white",
      "bg-blue-500",
      "bg-blue-500",
      "bg-blue-500",
      "bg-blue-500",
    ],
  };

  const scoreGrid = grids[score];

  return (
    <div className="grid grid-cols-3 gap-1">
      {scoreGrid.map((className:string, index:number) => (
        <div key={index} className={`w-2 h-2 ${className}`}></div>
      ))}
    </div>
  );
};

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function StarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { Button, Input, Label } from "@headlessui/react";
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

interface Employee {
  id: string;
  name: string;
}
interface ProductionLine {
  id: string;
  name: string;
}
interface RatedEmployee extends Employee {
  rating: number;
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
      const response = await fetch(
        `/api/rated-operateurs?line=${productionLine}`
      );
      if (!response.ok) throw new Error("Failed to fetch rated operateurs");
      const data = await response.json();
      setRatedOperateurs(data);
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
      const response = await fetchWithAuth(`api/supervisor-lignes/${getRoleIdFromToken()}/`);
      console.log(response);
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
      const response = await fetch(
        `/api/unrated-operateurs?line=${productionLine}`
      );
      if (!response.ok) throw new Error("Failed to fetch unrated operateurs");
      const data = await response.json();
      setUnratedOperateurs(data);
    } catch (error: any) {
      setError(error.message);
      setUnratedOperateurs([]);
    } finally {
      setUnratedLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 w-full">
      <div className="bg-background rounded-lg shadow-md bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Rated Operateurs</h2>
            <p className="text-muted-foreground">
              Review & rate the performance of operateurs  on your production line.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="production-line">Line</label>
            <Select
              defaultValue=""
              onValueChange={(value) => setProductionLine(value)}
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
                  className="flex items-center gap-2 p-4 bg-muted rounded-md"
                >
                  <div className="flex-1">
                    <div className="font-medium">{employee.name}</div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <StarIcon
                          key={index}
                          className={`w-5 h-5 ${
                            index < employee.rating
                              ? "fill-primary"
                              : "fill-muted stroke-muted-foreground"
                          }`}
                        />
                      ))}
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
              <p>No unrated operateurs found. everything is updated</p>
            ) : (
              unratedOperateurs
                .filter((employee) =>
                  employee.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center gap-2 p-4 bg-muted rounded-md"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{employee.name}</div>
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

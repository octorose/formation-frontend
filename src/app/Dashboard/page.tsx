// pages/index.tsx
"use client";
import React, { use, useEffect, useState } from "react";
import DefaultLayout from "@/Components/Layout/DefaultLayout";
import { Tabs } from "../Components/Tabs/tab";
import Candidats from "@/Components/Candidats/Candidats";
import Supervisors from "@/Components/SupervisorsCard/Supervisors";
import Cards from "../Components/3DCard/3d-cards";
import withAuth from "@/utils/HOC/withAuth";
import { getRoleFromToken } from "@/utils/getRoleFromToken";
import useFetch from "@/Hooks/useFetch";
import { fetchWithAuth } from "@/utils/api";
import { Module } from "module";
import { title } from "process";
import Dash from "@/Components/Dash/Dash";
import { PlusIcon } from "lucide-react";
import Formateur from "@/Components/Formateur/Formateurs";
interface Module {
  id: number;
  name: string;
  description: string;
}
interface ApiResponse<T> {
  results: T[];
  count: number;
}
const Home = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [totalModules, setTotalModules] = useState(0);

  const tabsRH = [
  
    {
      title: "Dashboard",
      value: "Dashboard",
      content: <Dash />,
    },
    {
      title: "Personnel",
      value: "Candidats",
      content: <Candidats />,
    },
    {
      title: "Modules",
      value: "Modules",
      content: (
        <div className="w-full overflow-hidden rounded-2xl text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-white to-slate-300">
          <div className="flex flex-row justify-between py-5 px-10 items-center text-graydark">
            <p>Modules</p>
            <button className="bg-graydark px-5 dark:bg-gray-100 text-white text-sm rounded-md  gap-2 shadow-md flex">
              <PlusIcon/>new Module
            </button>
          </div>

          <Cards />
        </div>
      ),
    },
    {
      title: "Supervisors",
      value: "Supervisors",
      content: <Supervisors />,
    },
  ];
  const tabsSupervisor = [ 
    {
      title: "Dashboard",
      value: "Dashboard",
      content: <Dash />,
    },
    {
      title: "Formateurs",
      value: "Formateurs",
      content: <Formateur />,
    },
    {
      title: "Candidats",
      value: "Candidats",
      content: <Candidats />,
    },
  ];

  const tabsCandidats = [ 
    {
      title: "Dashboard",
      value: "Dashboard",
      content: <Dash />,
    },
    {
      title: "Formateurs",
      value: "Formateurs",
      content: <Formateur />,
    },
    {
      title: "Candidats",
      value: "Candidats",
      content: <Candidats />,
    },
  ];

  const role = getRoleFromToken();
  return (
    <DefaultLayout importexport={true}>
      <div className="h-full">
        {role == "RH" ? (
          <Tabs
            tabs={tabsRH}
            activeTabClassName="bg-blue-200 dark:bg-blue-800 border-5 text-black dark:text-white"
          />
        ) : role == "Superviseur" ? (
          <Tabs
            tabs={tabsSupervisor}
            activeTabClassName="bg-blue-200 dark:bg-blue-800 border-5 text-black dark:text-white"
          />
        ) : role == "ResponsableFormation" ? (
          <>Responsable view</>
        ) : (
          <></>
        )}
      </div>
    </DefaultLayout>
  );
};

export default withAuth(Home);

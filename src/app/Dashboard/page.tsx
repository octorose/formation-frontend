// pages/index.tsx
"use client";
import React, {  useEffect, useState } from "react";
import DefaultLayout from "@/Components/Layout/DefaultLayout";
import { Tabs } from "../Components/Tabs/tab";
import Candidats from "@/Components/Candidats/Candidats";
import Supervisors from "@/Components/SupervisorsCard/Supervisors";
import ResponsableEcole from "@/Components/ResponsableEcoleCard/ResponsableEcole";
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
import Postes from "@/Components/Postes/Postes";
import Segments from "@/Components/SegmentCard/Segments";
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
      title: "Tableau de bord",
      value: "Dashboard",
      content: <Dash />,
    },
    {
      title: "Personnel",
      value: "Candidats",
      content: <Candidats />,
    },
    // {
    //   title: "Modules",
    //   value: "Modules",
    //   content: (
    //     <div className="w-full overflow-hidden rounded-2xl text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-white to-slate-300">
    //       <div className="flex flex-row justify-between py-5 px-10 items-center text-graydark">
    //         <p>Modules</p>
    //         <button  className="bg-graydark px-5 py-3 dark:bg-gray-100 text-white text-base rounded-md gap-2 shadow-md flex items-center justify-center hover:bg-gray-700 transition duration-300">

    //           <PlusIcon/>new Module
    //         </button>
    //       </div>

    //       <Cards />
    //     </div>
    //   ),
    // },
    {
      title: "Segments",
      value: "Segments",
      content: <Segments />,
    },
    {
      title: "Superviseurs",
      value: "Supervisors",
      content: <Supervisors />,
    },
    {
      title: "Responsable ecole formation",
      value: "ResponsableEcoleFormation",
      content: <ResponsableEcole />,
    },
  ];
  const tabsSupervisor = [
    {
      title: "Tableau de bord",
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
    {
      title: "Positions",
      value: "Postes",
      content: <Postes />,
    },
  ];
  const tabsResponsableEcole = [
    {
      title: "Tableau de bord",
      value: "Dashboard",
      content: <Dash />,
    },
    {
      title: "Formateurs",
      value: "Formateurs",
      content: <Formateur />,
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
        ) : role == "Formateur" ? (
          <Tabs
            tabs={tabsSupervisor}
            activeTabClassName="bg-blue-200 dark:bg-blue-800 border-5 text-black dark:text-white"
          />
        ) : role == "ResponsableEcoleFormation" ? (
          <Tabs
          tabs={tabsResponsableEcole}
          activeTabClassName="bg-blue-200 dark:bg-blue-800 border-5 text-black dark:text-white"
        />
        
        ) : (
          <></>
        )}
      </div>
    </DefaultLayout>
  );
};

export default withAuth(Home, [
  "RH",
  "Superviseur",
  "ResponsableEcoleFormation",
  "Formateur",
  "ResponsableFormation",
]);

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

import Contrats from "@/Components/Contrats/Contrats";
import TestTable from "@/Components/CustomTable/TestTable";


import Postes from "@/Components/Postes/Postes";
import Segments from "@/Components/SegmentCard/Segments";
import GroupsTable from '../Components/CustomTable/GroupeTable';
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
      title: "Candidats",
      value: "Candidats",
      content: <Candidats />,
    },
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
    {
      title: "Contrats",
      value: "Contrats",
      content: <Contrats />,
    },
    {
      title: "Tests",
      value: "Tests",
      content: <TestTable endpoint="/api/tests" />,
    },
    {
      title: "Groupes",
      value: "Groupes",
      content: <GroupsTable endpoint="/api/groups" searchResults={[]} />,
    }
  ];
  const tabsSegment = [
    {
      title: "Tableau de bord",
      value: "Dashboard",
      content: <Dash />,
    },
    {
      title: "Superviseurs",
      value: "Supervisors",
      content: <Supervisors />,
    },
    {
      title: "Postes",
      value: "Postes",
      content: <Postes />,
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
    // {

    //   title: "Contrats", 
    //   value: "Contrats",
    //   content: <Contrats />, 
    // },
    {
      title: "Postes",
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
    <DefaultLayout importexport={false}>
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
        
        ) : role == "Personnel" ? (
          <div>
            <h1
              className="text-2xl font-bold text-neutral-800 dark:text-neutral-200" style={{textAlign: 'center'}}>
              Bienvenue chez Leoni HRCore votre espace de travail personnel
            </h1>
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200" style={{textAlign: 'center'}}>
              Clickez sur les onglets pour accéder aux différentes fonctionnalités quand vous êtes prêt
            </h2>

          </div>
        ) : role == "Segment" ? (
          <Tabs
            tabs={tabsRH}
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
  "Personnel",
  "Segment",
]);

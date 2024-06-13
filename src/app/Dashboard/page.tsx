// pages/index.tsx
"use client";
import React from "react";
import DefaultLayout from "@/Components/Layout/DefaultLayout";
import { Tabs } from "../Components/Tabs/tab";
import Candidats from "@/Components/Candidats/Candidats";
import Supervisors from "@/Components/SupervisorsCard/Supervisors";
import Cards from "../Components/3DCard/3d-cards";
import withAuth from "@/utils/HOC/withAuth";
import { getRoleFromToken } from "@/utils/getRoleFromToken";

const Home = () => {
  const Module = [
    {
      name: "Module 1",
      description: "This is the first module",
    },
    {
      name: "Module 2",
      description: "This is the second module",
    },
    {
      name: "Module 3",
      description: "This is the third module",
    },
  ];

  const tabs = [
    {
      title: "Candidats",
      value: "Candidats",
      content: <Candidats />,
    },
    {
      title: "Modules",
      value: "Modules",
      content: (
        <div className="w-full overflow-hidden rounded-2xl text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-white to-slate-300">
          <div className="flex flex-row justify-between p-10 text-graydark">
            <p>Modules</p>
            <button className="bg-graydark px-5 dark:bg-gray-100 text-white rounded-md shadow-md">
              Add new Module
            </button>
          </div>
          <Cards Module={Module} />
        </div>
      ),
    },
    {
      title: "Supervisors",
      value: "Supervisors",
      content: <Supervisors />,
    },
  ];
  const role = getRoleFromToken();
  return (
    <DefaultLayout importexport={true}>
      <div className="h-full">
{role == 'RH' ?(        <Tabs
          tabs={tabs}
          activeTabClassName="bg-blue-200 dark:bg-blue-800 border-5 text-black dark:text-white"
        />): role == 'Superviseur' ? (
          <>fiw</>
        ):<></>}
      </div>
    </DefaultLayout>
  );
};

export default withAuth(Home);

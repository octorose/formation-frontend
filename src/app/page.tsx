'use client';
import { Metadata } from "next";
import DefaultLayout from "@/Components/Layout/DefaultLayout"
import { Tabs } from "./Components/Tabs/tab";
import Breadcrumb from "./Components/Breadcrumbs/Breadcrumb";
import CustomTable from "./Components/CustomTable/CustomTable";
import { SearchIcon } from "lucide-react";
import CardBarChart from "./Components/ui/charts/CardBarChart";
import Cards from "./Components/3DCard/3d-cards";

// export const metadata: Metadata = {
//   title:
//     "Leoni HRM",
//   description: "App to Help Hrs in different  phases Recruitment Training and supervising employees life Cycle...", 
// };

export default function Home() {
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
      content: (
        <div className="w-full  overflow-hidden   rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-white to-slate-300">
          <div className="flex flex-row justify-between text-graydark">
            <p>Candidats</p>
            <div className="border border-1 rounded-2xl p-1 text-sm flex flex-row bg-transparent items-center">
              <input
                type="text"
                placeholder={"Search for "}
                className="bg-transparent"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const searchquery = e.currentTarget.value;
                  }
                }}
              />
              <SearchIcon
                className="h-5 w-5 mx-3 text-blue-950"
                onClick={(e: any) => console.log(e)}
              />
            </div>
          </div>
          <div className="flex text-graydark my-5">
            <div className=" h-70 w-1/2 flex-col gap-3 rounded-lg shadow-lg  justify-between">
              <div className="flex rounded-xl  gap-1 h-1/2 w-full justify-center items-center">
                <div className="h-full w-1/2 px-5 flex flex-col justify-center">
                  <h1>12</h1>
                  <p className="text-slate-400 font-thin text-[20px]">
                    Totale Succeded
                  </p>
                </div>
                <div className="bg-black h-[60%] w-1"></div>
                <div className="h-full w-1/2 px-5 flex flex-col justify-center">
                  <h1>12</h1>
                  <p className="text-slate-400 font-thin text-[20px]">
                    Total Tests
                  </p>
                </div>
              </div>
              <div className="bg-black h-1 mx-auto w-11/12"></div>
              <div className="flex  gap-1 h-1/2 w-full justify-center items-center">
                <div className="h-full w-1/2 px-5 flex flex-col justify-center">
                  <h1>12</h1>
                  <p className="text-slate-400 font-thin text-[20px]">
                    Totale Failed
                  </p>
                </div>
                <div className="bg-black h-[60%] w-1"></div>
                <div className="h-full w-1/2 px-5 flex flex-col justify-center">
                  <h1>12</h1>
                  <p className="text-slate-400 font-thin text-[20px]">
                    Average Score
                  </p>
                </div>
              </div>
            </div>
            <div className="h-70 w-1/2">
              <CardBarChart />
            </div>
          </div>
          <CustomTable
            headres={[
              "Nom",
              "Prenom",
              "Date_naissance",
              "Sexe",
              "ApplicationSource",
            ]}
          />
        </div>
      ),
    },
    {
      title: "Modules",
      value: "Modules",
      content: (
        <div className="w-full  overflow-hidden   rounded-2xl  text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-white to-slate-300">
          <div className="flex flex-row justify-between p-10 text-graydark">
            <p>Modules</p>
            <button className="bg-graydark  px-5 dark:bg-gray-100 text-white   rounded-md shadow-md">
              Add new Module
            </button>
          </div>
           <Cards Module={Module} />
        </div>
      ),
    },
    {
      title: "Supervisors",
      value: "supervisors",
      content: (
        <div className="w-full overflow-hidden relative border-1 border rounded-2xl p-10 text-xl md:text-4xl font-bold  text-white bg-gradient-to-br from-white to-slate-300">
          <p>Supervisorss</p>
          <table className="w-full h-screen">
            <thead>
              <tr>
                <th>Supervisor</th>
                <th>Module</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Supervisor 1</td>
                <td>Module 1</td>
                <td>50%</td>
              </tr>
              <tr>
                <td>Supervisor 2</td>
                <td>Module 2</td>
                <td>100%</td>
              </tr>
              <tr>
                <td>Supervisor 3</td>
                <td>Module 3</td>
                <td>75%</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
  ];
  return (
    <DefaultLayout importexport={true}>
      <div className="h-full">
        <Tabs
          tabs={tabs}
          activeTabClassName="bg-blue-200 dark:bg-blue-800 border-5 text-black dark:text-white"
        />
      </div>
    </DefaultLayout>
  );
}

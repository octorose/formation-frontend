"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarLinkGroup from "./SidebarLinkGroup";
import logo from "@/images/logo-no-background.png";
import DashIcon from "../../../../public/assets/Icons/Dashboard";
import CandidatIcon from "../../../../public/assets/Icons/CandidatIcon";
import DynamicArrow from "../../../../public/assets/Icons/DynamicArrow";

import SettingIcon from "../../../../public/assets/Icons/SettingIcon";
import { get } from "http";
import { getRoleFromToken } from "@/utils/getRoleFromToken";
import HistoryIcon from "../../../../public/assets/Icons/HistoryIcon";


import { PlusIcon } from "lucide-react";


import { GroupIcon, PenSquareIcon, PopsicleIcon, RowsIcon, SparkleIcon } from "lucide-react";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FlagIcon } from "@heroicons/react/24/outline";


interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [role, setRole] = useState<string | null>(null);

  const pathname = usePathname();
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  let storedSidebarExpanded = "true";

  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  useEffect(() => {

    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
    
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  useEffect(() => {
    setRole(getRoleFromToken());
  }, []);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-start gap-2 px-6 py-5.5 lg:py-6.5">
        <Link href="/">
          <Image width={190} height={32} src={logo} alt="Logo" priority />
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              <React.Fragment>
                <Link
                  href="/Dashboard"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    (pathname === "/" || pathname.includes("dashboard")) &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <DashIcon />
                  Tableau de bord
                </Link>
              </React.Fragment>
{getRoleFromToken() == "Formateur" ? (
  <div>
    <SidebarLinkGroup
      activeCondition={
        pathname === "/forms" || pathname.includes("forms")
      }
    >
      {(handleClick, open) => {
        return (
          <React.Fragment>
            <Link
              href="/calendar"
              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                pathname.includes("calendar") &&
                "bg-graydark dark:bg-meta-4"
              }`}
              onClick={(e) => {
                e.preventDefault();
                sidebarExpanded
                  ? handleClick()
                  : setSidebarExpanded(true);
              }}
            >
              <CandidatIcon />
              Candidats
              <DynamicArrow open={open} />
            </Link>
            <div
              className={`translate transform overflow-hidden  ${
                !open && "hidden"
              }`}
            >
              <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                <li>
                  <Link
                    href="/#"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Détails
                  </Link>
                </li>
                <li>
                  <Link
                    href="/AddPersonnel"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Ajouter Manuellement
                  </Link>
                </li>
              </ul>
            </div>
          </React.Fragment>
        );
      }}
    </SidebarLinkGroup>

    <SidebarLinkGroup
      activeCondition={
        pathname === "/forms" || pathname.includes("forms")
      }
    >
      {(handleClick, open) => {
        return (
          <React.Fragment>
            <Link
              href="/calendar"
              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                pathname.includes("calendar") &&
                "bg-graydark dark:bg-meta-4"
              }`}
              onClick={(e) => {
                e.preventDefault();
                sidebarExpanded
                  ? handleClick()
                  : setSidebarExpanded(true);
              }}
            >
              <SparkleIcon width={15} />
              Polyvalence
              <DynamicArrow open={open} />
            </Link>
            <div
              className={`translate transform overflow-hidden  ${
                !open && "hidden"
              }`}
            >
              <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                <li>
                  <Link
                    href="/#"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Détails Globaux
                  </Link>
                </li>
                <li>
                  <Link
                    href="/AddPolyvalance"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Ajouter Polyvalence
                  </Link>
                </li>
              </ul>
            </div>
          </React.Fragment>
        );
      }}
    </SidebarLinkGroup>

    <SidebarLinkGroup
      activeCondition={
        pathname === "/forms" || pathname.includes("forms")
      }
    >
      {(handleClick, open) => {
        return (
          <React.Fragment>
            <Link
              href="#"
              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                pathname.includes("calendar") &&
                "bg-graydark dark:bg-meta-4"
              }`}
              onClick={(e) => {
                e.preventDefault();
                sidebarExpanded
                  ? handleClick()
                  : setSidebarExpanded(true);
              }}
            >
              <PenSquareIcon width={20} />
              Affectation
              <DynamicArrow open={open} />
            </Link>
            <div
              className={`translate transform overflow-hidden  ${
                !open && "hidden"
              }`}
            >
              <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                <li>
                  <Link
                    href="/#"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Formateur
                  </Link>
                </li>
                <li>
                  <Link
                    href="/AffectationOperateur"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Opérateur
                  </Link>
                </li>
              </ul>
            </div>
          </React.Fragment>
        );
      }}
    </SidebarLinkGroup>

    <SidebarLinkGroup
      activeCondition={
        pathname === "/forms" || pathname.includes("forms")
      }
    >
      {(handleClick, open) => {
        return (
          <React.Fragment>
            <Link
              href="/calendar"
              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                pathname.includes("calendar") &&
                "bg-graydark dark:bg-meta-4"
              }`}
              onClick={(e) => {
                e.preventDefault();
                sidebarExpanded
                  ? handleClick()
                  : setSidebarExpanded(true);
              }}
            >
              <FlagIcon width={20} />
              Postes
              <DynamicArrow open={open} />
            </Link>
            <div
              className={`translate transform overflow-hidden ${
                !open && "hidden"
              }`}
            >
              <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                <li>
                  <Link
                    href="/#"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Critères des Postes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/AddPoste"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Ajouter Poste
                  </Link>
                </li>
              </ul>
            </div>
          </React.Fragment>
        );
      }}
    </SidebarLinkGroup>

    <SidebarLinkGroup
      activeCondition={
        pathname === "/forms" || pathname.includes("forms")
      }
    >
      {(handleClick, open) => {
        return (
          <React.Fragment>
            <Link
              href="/"
              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                pathname.includes("calendar") &&
                "bg-graydark dark:bg-meta-4"
              }`}
              onClick={(e) => {
                e.preventDefault();
                sidebarExpanded
                  ? handleClick()
                  : setSidebarExpanded(true);
              }}
            >
              <RowsIcon />
              Lignes
              <DynamicArrow open={open} />
            </Link>
            <div
              className={`translate transform overflow-hidden ${
                !open && "hidden"
              }`}
            >
              <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                <li>
                  <Link
                    href="/Lignes"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Gérer Lignes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Tests
                  </Link>
                </li>
              </ul>
            </div>
          </React.Fragment>
        );
      }}
    </SidebarLinkGroup>

    <SidebarLinkGroup
      activeCondition={
        pathname === "/forms" || pathname.includes("forms")
      }
    >
      {(handleClick, open) => {
        return (
          <React.Fragment>
            <Link
              href="/Calendar"
              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                pathname.includes("calendar") &&
                "bg-graydark dark:bg-meta-4"
              }`}
              onClick={(e) => {
                e.preventDefault();
                sidebarExpanded
                  ? handleClick()
                  : setSidebarExpanded(true);
              }}
            >
              <FaChalkboardTeacher />
              Formations
              <DynamicArrow open={open} />
            </Link>
            <div
              className={`translate transform overflow-hidden ${
                !open && "hidden"
              }`}
            >
              <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                <li>
                  <Link
                    href="/AddFormation"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Ajouter Formation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/Calendar"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Calendrier
                  </Link>
                </li>
              </ul>
            </div>
          </React.Fragment>
        );
      }}
    </SidebarLinkGroup>
  </div>
) :               getRoleFromToken() == "RH" ? (
                getRoleFromToken() == "RH" ? (
  <div>
    <SidebarLinkGroup
      activeCondition={
        pathname === "/forms" || pathname.includes("forms")
      }
    >
      {(handleClick, open) => {
        return (
          <React.Fragment>
            <Link
              href="/calendar"
              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                pathname.includes("calendar") &&
                "bg-graydark dark:bg-meta-4"
              }`}
              onClick={(e) => {
                e.preventDefault();
                sidebarExpanded
                  ? handleClick()
                  : setSidebarExpanded(true);
              }}
            >
              <CandidatIcon />
              Candidats
              <DynamicArrow open={open} />
            </Link>
            <div
              className={`translate transform overflow-hidden  ${
                !open && "hidden"
              }`}
            >
              <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                <li>
                  <Link
                    href="/#"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Détails
                  </Link>
                </li>
                <li>
                  <Link
                    href="/AddPersonnel"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Ajouter Manuellement
                  </Link>
                </li>
              </ul>
            </div>
          </React.Fragment>
        );
      }}
    </SidebarLinkGroup>
    <SidebarLinkGroup
      activeCondition={
        pathname === "/forms" || pathname.includes("forms")
      }
    >
      {(handleClick, open) => {
        return (
          <React.Fragment>
            <Link
              href="/calendar"
              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                pathname.includes("calendar") &&
                "bg-graydark dark:bg-meta-4"
              }`}
              onClick={(e) => {
                e.preventDefault();
                sidebarExpanded
                  ? handleClick()
                  : setSidebarExpanded(true);
              }}
            >
              <CandidatIcon />
              Segments
              <DynamicArrow open={open} />
            </Link>
            <div
              className={`translate transform overflow-hidden  ${
                !open && "hidden"
              }`}
            >
              <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                <li>
                  <Link
                    href="/#"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Détails
                  </Link>
                </li>
                <li>
                  <Link
                    href="/AddSegment"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Ajouter Manuellement
                  </Link>
                </li>
              </ul>
            </div>
          </React.Fragment>
        );
      }}
    </SidebarLinkGroup>
    <SidebarLinkGroup
      activeCondition={
        pathname === "/forms" || pathname.includes("forms")
      }
    >
      {(handleClick, open) => {
        return (
          <React.Fragment>
            <Link
              href="/calendar"
              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                pathname.includes("calendar") &&
                "bg-graydark dark:bg-meta-4"
              }`}
              onClick={(e) => {
                e.preventDefault();
                sidebarExpanded
                  ? handleClick()
                  : setSidebarExpanded(true);
              }}
            >
              <FaChalkboardTeacher />
              Formateurs
              <DynamicArrow open={open} />
            </Link>
            <div
              className={`translate transform overflow-hidden  ${
                !open && "hidden"
              }`}
            >
              <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                <li>
                  <Link
                    href="/#"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Détails
                  </Link>
                </li>
                <li>
                  <Link
                    href="/AddFormateur"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Ajouter Manuellement
                  </Link>
                </li>
              </ul>
            </div>
          </React.Fragment>
        );
      }}
    </SidebarLinkGroup>
    <SidebarLinkGroup
      activeCondition={
        pathname === "/forms" || pathname.includes("forms")
      }
    >
      {(handleClick, open) => {
        return (
          <React.Fragment>
            <Link
              href="/calendar"
              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                pathname.includes("calendar") &&
                "bg-graydark dark:bg-meta-4"
              }`}
              onClick={(e) => {
                e.preventDefault();
                sidebarExpanded
                  ? handleClick()
                  : setSidebarExpanded(true);
              }}
            >
              <GroupIcon />
              Superviseurs
              <DynamicArrow open={open} />
            </Link>
            <div
              className={`translate transform overflow-hidden  ${
                !open && "hidden"
              }`}
            >
              <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                <li>
                  <Link
                    href="/#"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Détails
                  </Link>
                </li>
                <li>
                  <Link
                    href="/AddSupervisor"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Ajouter Manuellement
                  </Link>
                </li>
              </ul>
            </div>
          </React.Fragment>
        );
      }}
    </SidebarLinkGroup>
    <SidebarLinkGroup
      activeCondition={
        pathname === "/forms" || pathname.includes("forms")
      }
    >
      {(handleClick, open) => {
        return (
          <React.Fragment>
            <Link
              href="/calendar"
              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                pathname.includes("calendar") &&
                "bg-graydark dark:bg-meta-4"
              }`}
              onClick={(e) => {
                e.preventDefault();
                sidebarExpanded
                  ? handleClick()
                  : setSidebarExpanded(true);
              }}
            >
              <CandidatIcon />
              Responsables Ecole Formation
              <DynamicArrow open={open} />
            </Link>
            <div
              className={`translate transform overflow-hidden  ${
                !open && "hidden"
              }`}
            >
              <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                <li>
                  <Link
                    href="/#"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Détails
                  </Link>
                </li>
                <li>
                  <Link
                    href="/AddResponsableEcole"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Ajouter Responsable Ecole
                  </Link>
                </li>
              </ul>
            </div>
          </React.Fragment>
        );
      }}
    </SidebarLinkGroup>
    <SidebarLinkGroup
      activeCondition={
        pathname === "/forms" || pathname.includes("forms")
      }
    >
      {(handleClick, open) => {
        return (
          <React.Fragment>
            <Link
              href="/calendar"
              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                pathname.includes("calendar") &&
                "bg-graydark dark:bg-meta-4"
              }`}
              onClick={(e) => {
                e.preventDefault();
                sidebarExpanded
                  ? handleClick()
                  : setSidebarExpanded(true);
              }}
            >
              <FaChalkboardTeacher />
              Polyvalences
              <DynamicArrow open={open} />
            </Link>
            <div
              className={`translate transform overflow-hidden  ${
                !open && "hidden"
              }`}
            >
              <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                <li>
                  <Link
                    href="/#"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Détails
                  </Link>
                </li>
                <li>
                  <Link
                    href="/AddPolyvalence"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/#" && "text-white"
                    }`}
                  >
                    Ajouter Polyvalence
                  </Link>
                </li>
              </ul>
            </div>
          </React.Fragment>
        );
      }}
    </SidebarLinkGroup>
  </div>


              ) : getRoleFromToken() == "ResponsableEcoleFormation" ? (
                <div>
                  <SidebarLinkGroup
                    activeCondition={
                      pathname === "/forms" || pathname.includes("forms")
                    }
                  >
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <Link
                            href="/calendar"
                            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                              pathname.includes("calendar") &&
                              "bg-graydark dark:bg-meta-4"
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded
                                ? handleClick()
                                : setSidebarExpanded(true);
                            }}
                          >
                            <CandidatIcon />
                            Formateur
                            <DynamicArrow open={open} />
                          </Link>
                          <div
                            className={`translate transform overflow-hidden  ${
                              !open && "hidden"
                            }`}
                          >
                            <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                              <li>
                                <Link
                                  href="/#"
                                  className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                    pathname === "/#" && "text-white"
                                  }`}
                                >
                                  Details
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/AddFormateur"
                                  className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                    pathname === "/#" && "text-white"
                                  }`}
                                >
                                  Add Formateur
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>

                  <SidebarLinkGroup
                    activeCondition={
                      pathname === "/forms" || pathname.includes("forms")
                    }
                  >
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <Link
                            href="/calendar"
                            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                              pathname.includes("calendar") &&
                              "bg-graydark dark:bg-meta-4"
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded
                                ? handleClick()
                                : setSidebarExpanded(true);
                            }}
                          >
                            <HistoryIcon />
                            History
                            <DynamicArrow open={open} />
                          </Link>
                          <div
                            className={`translate transform overflow-hidden ${
                              !open && "hidden"
                            }`}
                          >
                            <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                              <li>
                                <Link
                                  href="/#"
                                  className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                    pathname === "/#" && "text-white"
                                  }`}
                                >
                                  Supervisors
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/#"
                                  className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                    pathname === "/#" && "text-white"
                                  }`}
                                >
                                  Groups
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/#"
                                  className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                    pathname === "/#" && "text-white"
                                  }`}
                                >
                                  Tests
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                  <li>
                    <Link
                      href="/settings"
                      className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        pathname.includes("settings") &&
                        "bg-graydark dark:bg-meta-4"
                      }`}
                    >
                      <SettingIcon />
                      Settings
                    </Link>
                  </li>
                </div>
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              OTHERS
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              <SidebarLinkGroup
                activeCondition={
                  pathname === "/auth" || pathname.includes("auth")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        href="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname === "/auth" || pathname.includes("auth")) &&
                          "bg-graydark dark:bg-meta-4"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        Maybe We Will need Something here
                        <DynamicArrow open={open} />
                      </Link>

                      <div
                        className={`translate transform overflow-hidden ${
                          !open && "hidden"
                        }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                              href="/"
                              className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white"
                            >
                              Some
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/"
                              className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white"
                            >
                              Thing
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

"use client";
import React, { useState, ReactNode } from "react";
import Sidebar from "@/Components/Sidebar";
import Header from "@/Components/Header";
import BreadcrumbsV2 from "../Breadcrumbs/BreadcrumbsV2";

export default function DefaultLayout({
  children, importexport = false
}: {
  children: React.ReactNode;
  importexport?: boolean;
}) {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <div className="flex h-screen  overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <BreadcrumbsV2 importexport={true} />
          <main>
            <div className="mx-auto max-w-screen-2xl  md:p-6 ">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}

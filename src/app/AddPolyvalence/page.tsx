"use client";

import DefaultLayout from "@/Components/Layout/DefaultLayout";
import Polyvalance from "@/Components/PolyvalanceCard/Polyvalance";
import React from "react";
import withAuth from "@/utils/HOC/withAuth";

function page() {
  return (
    <DefaultLayout importexport={false}>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-5">
          Ajouter une polyvalence
        </h1>
      </div>
      <Polyvalance />
    </DefaultLayout>
  );
}

export default withAuth(page, ["RH", "Superviseur"]);

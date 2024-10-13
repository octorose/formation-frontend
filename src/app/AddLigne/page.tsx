"use client";

import DefaultLayout from "@/Components/Layout/DefaultLayout";
import React from "react";
import withAuth from "@/utils/HOC/withAuth";
import LigneForm from "@/Components/Forms/LigneForm";

function page() {
  return (
    <DefaultLayout>
      <LigneForm/>
    </DefaultLayout>
  );
}

export default withAuth(page, ['RH']);

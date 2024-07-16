"use client";

import PersonnelForm from "@/Components/Forms/PersonnelForm";
import DefaultLayout from "@/Components/Layout/DefaultLayout";
import withAuth from "@/utils/HOC/withAuth";
import React from "react";

function page() {
  return (
    <>
      <PersonnelForm />
    </>
  );
}

export default withAuth(page);

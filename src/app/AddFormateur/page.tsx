'use client'
import Formateur from "@/Components/Formateur/Formateurs";
import FormateurForm from "@/Components/Forms/FormateurForm";
import PersonnelForm from "@/Components/Forms/PersonnelForm";
import DefaultLayout from "@/Components/Layout/DefaultLayout";
import React from "react";
import withAuth from '@/utils/HOC/withAuth';

function page() {
  return (
    <>
      <FormateurForm />
    </>
  );
}

export default withAuth(page);

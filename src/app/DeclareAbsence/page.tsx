import React from "react";
import DeclareAbsenceForm from "@/Components/Forms/DeclareAbscenceForm";
import DefaultLayout from "@/Components/Layout/DefaultLayout";

function page() {
  return (

      <DefaultLayout importexport={false}>
        <DeclareAbsenceForm />
      </DefaultLayout>
  );
}

export default page;

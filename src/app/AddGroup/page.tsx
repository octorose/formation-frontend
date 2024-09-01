"use client";

import DefaultLayout from "@/Components/Layout/DefaultLayout";
import React from "react";
import withAuth from "@/utils/HOC/withAuth";
import GroupForm from "@/Components/Forms/GroupForm";

function page() {
  return (
    <div>
      <GroupForm />
    </div>
  );
}

export default withAuth(page, ["RH"]);

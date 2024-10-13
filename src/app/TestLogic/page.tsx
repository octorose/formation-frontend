"use client";

import dynamic from "next/dynamic";
import withAuth from "@/utils/HOC/withAuth";
import DefaultLayout from "@/Components/Layout/DefaultLayout";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/utils/api";
import { getRoleIdFromToken } from "@/utils/getRoleIdFromToken";
import { useRouter } from "next/router";

const DynamicQuizComponent = dynamic(() => import("@/TestLogic/Quiz"), {
  ssr: false, // Disable server-side rendering
});

function Page() {
  const [testPassed, setTestPassed] = useState(false);

  const passedoroNot = async () => {
    try {
      const response = await fetchWithAuth(
        `api/check-test/${getRoleIdFromToken()}/TestLogic/`
      );
      const data = await response.json();
      setTestPassed(data.test_passed);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    passedoroNot();
  }, []);

  useEffect(() => {
    if (testPassed) {
      window.location.href = "/NotAllowed";
    }
  }, [testPassed]);

  return (
    <DefaultLayout>{!testPassed && <DynamicQuizComponent />}</DefaultLayout>
  );
}

export default withAuth(Page, [
  "RH",
  "Formateur",
  "ResponsableEcoleFormation",
  "Personnel",
]);

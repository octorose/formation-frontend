"use client"
import DefaultLayout from '@/Components/Layout/DefaultLayout';
import React from 'react'
import withAuth from '@/utils/HOC/withAuth';
import Affectation from '@/Components/AffectationCard/Affectation';

function page() {
  return (
    <DefaultLayout importexport={false}>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-7 text-gray-800">
          Affectation des Operateurs
        </h1>
      </div>
      <Affectation/>
    </DefaultLayout>
  );
}

export default withAuth(page, ["RH","Superviseur","Formateur"]);
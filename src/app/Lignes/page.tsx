"use client";
import LigneTable from '@/Components/CustomTable/LignesTable';
import DefaultLayout from '@/Components/Layout/DefaultLayout';
import React, { useState } from 'react'
import GlobalButton from '../Components/globalButton/globalButton';
import { Plus, PlusIcon } from 'lucide-react';
import SearchComponent from '@/Components/SearchComponent/Search';

function page() {

  return (
    <DefaultLayout>
      <div className="flex items-center space-x-4 justify-end  ">
        <div className="rounded-2xl p-1 text-sm flex flex-row bg-transparent items-center">
          {/* <SearchComponent
            onResults={handleSearchResults}
            onLoading={handleLoading}
            onError={handleError}
            endpoint="api/search-responsable_formation_ecole/"
          /> */}
        </div>

        <a
          href="/AddLigne"
          className="bg-graydark px-5 py-3 dark:bg-gray-100 text-white text-base rounded-md gap-2 shadow-md flex items-center justify-center hover:bg-gray-700 transition duration-300"
        >
          <PlusIcon /> Ajouter ligne
        </a>
      </div>
      <div>
        <LigneTable />
      </div>
    </DefaultLayout>
  );
}

export default page
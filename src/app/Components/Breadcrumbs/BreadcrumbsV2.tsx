import React from "react";
import Breadcrumb from "./Breadcrumb";

function BreadcrumbsV2({ importexport }: { importexport?: boolean }) {
  return (
    <div className="flex flex-row justify-between p-5 pb-0 mx-20">
      <Breadcrumb />
      {importexport && (
        <div className="flex gap-1 justify-center h-4/5">
          <button className="bg-graydark px-5 dark:bg-gray-100 text-white rounded-md shadow-md">
            importer un nouveau groupe
          </button>
          <button className="bg-slate-50 px-5 dark:bg-gray-100 text-black rounded-md shadow-md">
            exporter les données
          </button>
        </div>
      )}
    </div>
  );
}

export default BreadcrumbsV2;

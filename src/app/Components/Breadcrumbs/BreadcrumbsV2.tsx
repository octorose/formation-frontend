import React from 'react'
import Breadcrumb from './Breadcrumb';

function BreadcrumbsV2(
    {
        importexport,
        uploadCIN,

    }: {
        importexport?: boolean;
        uploadCIN?: boolean;
    }
) {
  return (
    <div className="flex flex-row justify-between p-5 pb-0 mx-20">
      <Breadcrumb />
      {importexport && (
        <div className="flex gap-1 justify-center h-4/5">
          <button
     
            className="bg-graydark  px-5 dark:bg-gray-100 text-white   rounded-md shadow-md"
          >
            import new group
          </button>
          <button
            className="bg-slate-50  px-5 dark:bg-gray-100 text-black  rounded-md shadow-md"
          >
            export data
          </button>
          
          {uploadCIN && (
            <button
              className="bg-blue-500 px-5 text-white rounded-md shadow-md"
              onClick={() => {
                
                console.log("Upload CIN clicked");
              }}
            >
              Upload CIN
            </button>
          )}
          
        </div>
      )}
    </div>
  );
}

export default BreadcrumbsV2
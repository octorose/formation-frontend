import React from 'react'
import CustomTable from '../CustomTable/CustomTable';
import { SearchIcon } from 'lucide-react';

function Supervisors() {
  return (
    <div>
      <div className="w-full  overflow-hidden   rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-white to-slate-300">
        <div className="flex flex-row justify-between text-graydark">
          <p>Supervisors</p>
          <div className="border border-1 rounded-2xl p-1 text-sm flex flex-row bg-transparent items-center">
            <input
              type="text"
              placeholder={"Search for "}
              className="bg-transparent"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const searchquery = e.currentTarget.value;
                }
              }}
            />
            <SearchIcon
              className="h-5 w-5 mx-3 text-blue-950"
              onClick={(e: any) => console.log(e)}
            />
          </div>
        </div>
    
        <CustomTable
          headres={[
            "Nom",
            "Prenom",
            "Line of Prod",
            "date of creation"
          ]}
        />
      </div>
    </div>
    
  );
}

export default Supervisors
import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react'; 
import SearchComponent from '../SearchComponent/Search';
import ResponsableFormationEcoleTable from '../CustomTable/ResponsableFormationEcoleTable';

function ResponsableFormationEcole() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearchResults = (results: any[]) => {
    setSearchResults(results);
  };

  const handleLoading = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  const handleError = (error: string | null) => {
    setError(error);
  };

  return (
    <div>
      <div className="w-full overflow-hidden rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-white to-slate-300">
        <div className="flex flex-row justify-between text-graydark">
          <p>Responsable Formation Ecole</p>
          <div className="flex items-center space-x-4">
            <div className="rounded-2xl p-1 text-sm flex flex-row bg-transparent items-center">
              <SearchComponent
                onResults={handleSearchResults}
                onLoading={handleLoading}
                onError={handleError}
                endpoint="api/search-responsable_formation_ecole/"
              />
            </div>
          
            <a
              href="/AddResponsableEcole"
              className="bg-graydark px-5 py-3 dark:bg-gray-100 text-white text-base rounded-md gap-2 shadow-md flex items-center justify-center hover:bg-gray-700 transition duration-300"
            >
              <PlusIcon /> Add Responsable Ecole
            </a>
          </div>
        </div>

        <ResponsableFormationEcoleTable 
          endpoint="api/responsable_formation_ecole/"
          searchResults={searchResults}
        />
      </div>
    </div>
  );
}

export default ResponsableFormationEcole;

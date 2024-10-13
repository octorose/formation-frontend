import React, { useState } from "react";
import CustomTable from "../CustomTable/CustomTable";
import { Plus, SearchIcon } from "lucide-react";
import SupervisorsTable from "../CustomTable/SupervisorsTable";
import SearchComponent from "../SearchComponent/Search";
import GlobalButton from "../globalButton/globalButton";
import SegmentsTable from "../CustomTable/SegmentTable";

function Segments() {
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
      <div className="w-full  overflow-hidden   rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-white to-slate-300">
        <div className="flex flex-row justify-between text-graydark">
          <p>Segments</p>
          <div className=" rounded-2xl p-1 text-sm flex flex-row bg-transparent items-center">
            <SearchComponent
              onResults={handleSearchResults}
              onLoading={handleLoading}
              onError={handleError}
              endpoint="api/Segments-search"
            />
          </div>
        </div>

        <SegmentsTable
          endpoint="api/segments"
          searchResults={searchResults}
        />
      </div>
      <div style={{ position: "fixed", bottom: "20px", right: "20px" }}>
        <GlobalButton
          onClick={() => (window.location.href = "/AddSupervisor")}
          className="bg-blue-950 w-14 h-14 rounded-full flex items-center justify-center shadow-xl text-white mr-10"
          aria-label="add"
        >
          <Plus />
        </GlobalButton>
      </div>
    </div>
  );
}

export default Segments;

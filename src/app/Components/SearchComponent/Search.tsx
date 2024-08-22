import React, { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";
import useFetch from "@/Hooks/useFetch";
import { fetchWithAuth } from "@/utils/api";
import { on } from "events";

interface SearchComponentProps {
  onResults: (results: any[]) => void;
  onLoading: (isLoading: boolean) => void;
  onError: (error: string | null) => void;
  endpoint: string;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  onResults,
  onLoading,
  onError,
  endpoint,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [fetchTimeout, setFetchTimeout] = useState<NodeJS.Timeout | null>(null);
  const url = `${endpoint}?query=${debouncedQuery}`;

  useEffect(() => {
    if (debouncedQuery.trim() !== "") {
        console.log(url);
        
          const fetchData = async () => {
            try {
              const fetchedData = await fetchWithAuth(url);
              console.log(fetchedData);
              
              onLoading(true);
              onResults(fetchedData);
              onLoading(false);
            } catch (err) {
              onError((err as Error).message);
            } finally {
              onLoading(false);
            }
          };
          fetchData();
    }
    else{
      onResults([]);
    }
  }, [debouncedQuery]);

  const fetchData =  () => {
    
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      setDebouncedQuery(searchQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setSearchQuery(value);

    if (fetchTimeout) {
      clearTimeout(fetchTimeout);
    }

    const timeout = setTimeout(() => {
      setDebouncedQuery(value);
    }, 500);

    setFetchTimeout(timeout);
  };

  return (
    <div className="border border-1 rounded-2xl p-1 px-3 text-sm flex flex-row bg-transparent items-center">
      <input
        type="text"
        placeholder="Search for"
        className="bg-transparent"
        value={searchQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <SearchIcon
        className="h-5 w-5 mx-3 text-blue-950"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchComponent;

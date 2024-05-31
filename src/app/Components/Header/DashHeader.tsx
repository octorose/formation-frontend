import React from "react";
import { Button } from "../ui/button";
import { ArrowLeftIcon, SearchIcon } from "lucide-react";

function DashHeader({ handleSearch, employee,Topic }: any) {
  const AnOrA = (word: string) => {
    const vowels = ["a", "e", "i", "o", "u"];
    return vowels.includes(word[0].toLowerCase()) ? "an" : "a";
  };
  return (
    <div className="">
      <div className="flex flex-col  justify-center items-center mb-10">
        <h1 className="text-2xl font-semibold text-blue-950">
          Search for {AnOrA(Topic) + " " + Topic}
        </h1>
        {
          Topic == "Candidates" && (        <p className="text-sm text-blue-950">
          Search for a {Topic} to view their profile
        </p>)
        }

      </div>
      <div className="flex items-center gap-5">
        <Button size="icon" variant="outline">
          <ArrowLeftIcon className="h-4 w-4 text-blue-950" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="font-semibold text-lg text-blue-950 md:text-xl">
          {Topic + "s"}
        </h1>
        <div className="ml-auto flex items-center  gap-2">
          <div className="flex px-2 text-blue-950  items-center justify-start border  rounded-md w-full">
            <input
              type="text"
              placeholder={"Search for " + Topic}
              className="border-0 text-blue-950 outline-none font-bold text-ft-ts placeholder:italic bg-transparent w-full rounded-md"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const searchquery = e.currentTarget.value;
                  handleSearch(searchquery);
                }
              }}
            />
            <SearchIcon
              className="h-5 w-5 mx-3 text-blue-950"
              onClick={(e) => handleSearch(e)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashHeader;

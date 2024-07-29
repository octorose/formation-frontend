import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "@/utils/api";
import ResponsivePagination from "react-responsive-pagination";

interface Test {
  cin: string;
  nom: string;
  prenom: string;
  typeTest: string;
  dateTest: string;
  noteTest: number;
}

interface ApiResponse<T> {
  results: T[];
  count: number;
}

interface TestTableProps {
  endpoint: string;
}

function TestTable({ endpoint }: TestTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [tests, setTests] = useState<Test[]>([]);
  const [totalTests, setTotalTests] = useState(0);

  const fetchData = async () => {
    const response: ApiResponse<Test> = await fetchWithAuth(
      `${endpoint}?page=${currentPage}`
    );
    setTests(response.results);
    setTotalTests(response.count);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, endpoint]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="rounded-sm bg-transparent px-5 pb-2.5 pt-6 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex flex-col">
        <div className="grid grid-cols-6 rounded-sm text-black dark:text-white bg-gray-2 dark:bg-meta-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">CIN</h5>
          </div>
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Nom</h5>
          </div>
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Prénom</h5>
          </div>
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Type de test</h5>
          </div>
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Date de test</h5>
          </div>
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Note de test</h5>
          </div>
        </div>
        {tests.map((test, key) => (
          <div
            className={`grid grid-cols-6 text-base ${
              key === tests.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={key}
          >
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{test.cin}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{test.nom}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{test.prenom}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{test.typeTest}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{test.dateTest}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{test.noteTest}</p>
            </div>
          </div>
        ))}
      </div>
      <ResponsivePagination
        current={currentPage}
        total={Math.ceil(totalTests / 10)}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default TestTable;

import React, { useEffect, useState } from "react";
import ResponsivePagination from "react-responsive-pagination";
import { TrashIcon } from "lucide-react";
import Loader from "../Loaders/Loader";
import Swal from "sweetalert2";
import { deleteWithAuth, fetchWithAuth } from "../../utils/api";

interface Contrat {
  id: number;
  agent_id: number;
  type_contrat: string;
  date_creation_contrat: string;
  duree_contrat: number;
}

interface TableHeaderProps {
  header: string;
  index: number;
  totalHeaders: number;
}

const TableHeader: React.FC<TableHeaderProps> = ({ header, index, totalHeaders }) => {
  const isFirst = index === 0;
  const isLast = index === totalHeaders - 1;

  const classNames = `py-3.5 pl-4 pr-3 text-center text-white dark:text-black font-medium text-lg bg-black dark:bg-white text-neutral-500
  ${isFirst ? "rounded-tl-xl" : ""}
  ${isLast ? "rounded-tr-xl" : ""}`;

  return <th className={classNames}>{header}</th>;
};

const ContratTable: React.FC<{ headers: string[]; searchResults: Contrat[] }> = ({
  headers,
  searchResults,
}) => {
  const perPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<Contrat | null>(null);

  const totalPages = Math.ceil(searchResults.length / perPage);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    iconColor: "orange",
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  const deleteContract = async (id : any) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/api/contrats/delete/"+id, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(error);
      Toast.fire({
        icon: "error",
        title: "Failed to delete contract",
      });
    }
  };

  const fetchContracts = async () => {
    try {
      //setIsLoading(true);
      const response = await fetchWithAuth(`/api/contrats?page=${currentPage}`);
      const fetchedData = await response.json();
      // Assuming fetchedData contains the correct structure based on your API response
      // setContracts(fetchedData.results);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    //fetchContracts();
    console.log(searchResults)
  }, []);

  return (
    <div className="w-full">
      {!isLoading ? (
        <div>
          <div className="flex justify-center">
            <table className="w-9/12">
              <thead className="rounded-t-xl rounded-b-xl">
                <tr className="rounded-lg h-12 flex-shrink-0 bg-ft-gray-dark-blue rounded-t-xl rounded-b-xl">
                  {headers.map((header, index) => (
                    <TableHeader
                      key={index}
                      header={header}
                      index={index}
                      totalHeaders={headers.length}
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {searchResults.map((contract) => (
                  <tr
                    key={contract.id}
                    className="p-2 py-5 text-center rounded-t-lg rounded-b-lg border-b-2 text-base cursor-pointer text-neutral-900"
                  >
                    <td>{contract.agent_id}</td>
                    <td>{contract.type_contrat}</td>
                    <td>{contract.date_creation_contrat}</td>
                    <td>{contract.duree_contrat}</td>
                    <td>
                      <button onClick={() => deleteContract(contract.id)}>
                        <TrashIcon
                          size={20}
                          className="w-4 h-4 text-red-500 cursor-pointer hover:animate-bounce"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ResponsivePagination
            current={currentPage}
            total={totalPages}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default ContratTable;

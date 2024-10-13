import React, { useEffect, useState } from "react";
import ResponsivePagination from "react-responsive-pagination";
import { deleteWithAuth, fetchWithAuth, patchWithAuth, putWithAuth } from "@/utils/api";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import useAlert from "@/Hooks/useAlert";
import Modal from "../GlobalModal/Modal";
import Swal from "sweetalert2";

interface Group {
  id: number;
  name: string;
  Effectif: number;
  created_at: string;
}

interface ApiResponse<T> {
  results: T[];
  count: number;
}

function GroupsTable({
  endpoint,
  searchResults,
}: {
  endpoint: string;
  searchResults: any[];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [Groups, setGroups] = useState<Group[]>([]);
  const { alert, setAlert } = useAlert();
  const [totalGroups, setTotalGroups] = useState(0);
  const [GroupToDelete, setGroupToDelete] = useState({} as any);
  const [GroupToEdit, setGroupToEdit] = useState({} as any);
  const { alert: alert2, setAlert: setAlert2 } = useAlert();

  const fetchData = async () => {
    const response = await fetchWithAuth(
      `${endpoint}`
    );
    console.log("Effectif", response);

    setGroups(response);
    setTotalGroups(response);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, endpoint]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

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

  const handleDelete = async (group: any) => {
    if (GroupToDelete?.name === group.name) {
      try {
        const response = await deleteWithAuth(`${endpoint}/${group.id}/delete/`);
        if (!response || response.status === 204) {
          Toast.fire({
            icon: "success",
            title: "Group and associated candidates deleted successfully!",
            iconColor: "green",
          });
        }
        fetchData(); // Refresh the table after deletion
        setAlert2((prev) => ({ ...prev, isOpen: false }));
      } catch (error) {
        console.error(error);
        Toast.fire({
          icon: "error",
          title: "An error occurred while deleting the group and candidates.",
          iconColor: "red",
        });
      }
    } else {
      Toast.fire({
        icon: "error",
        title: "Invalid group name",
      });
    }
  };

  const handleEdit = (group: any) => {
    setGroupToEdit(group);
    setAlert((prev) => ({ ...prev, isOpen: true }));
  };

  const updateGroup = async (group: any) => {
    try {
      await patchWithAuth(`${endpoint}/${group.id}/update/`, {
        name: group.name,
        Effectif: group.Effectif,
      });
      Toast.fire({
        icon: "success",
        title: "Group updated successfully!",
        iconColor: "green",
      });

      fetchData();
      setAlert((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      console.error("Failed to update the group", error);
      Toast.fire({
        icon: "error",
        title: "An error occurred while updating the group.",
        iconColor: "red",
      });
    }
  };

  return (
    <div className="rounded-sm bg-transparent px-5 pb-2.5 pt-6 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm text-black dark:text-white bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Name
            </h5>
          </div>
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Created At
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Effectif
            </h5>
          </div>

          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Actions
            </h5>
          </div>
        </div>
        {searchResults !== undefined && searchResults.length > 0 ? (
          <>
            {searchResults.map((group: Group, key: number) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-4 text-base ${
                  key === Groups.length - 1
                    ? ""
                    : "border-b border-stroke dark:border-strokedark"
                }`}
                key={key}
              >
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="hidden text-black dark:text-white sm:block">
                    {group.name}
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    {new Date(group.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{group.Effectif}</p>
                </div>

                <div className="hidden items-center justify-center gap-4 p-2.5 sm:flex xl:p-5">
                  <button
                    className="text-black dark:text-white"
                    onClick={() => handleEdit(group)}
                  >
                    <Edit2Icon />
                  </button>
                  <button
                    className="text-black dark:text-white"
                    onClick={() => {
                      setGroupToDelete(group);
                      setAlert2((prev) => ({ ...prev, isOpen: true }));
                    }}
                  >
                    <Trash2Icon />
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {Groups?.map((group: Group, key: number) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-4 text-base ${
                  key === Groups.length - 1
                    ? ""
                    : "border-b border-stroke dark:border-strokedark"
                }`}
                key={key}
              >
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="hidden text-black dark:text-white sm:block">
                    {group.name}
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    {new Date(group.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{group.Effectif}</p>
                </div>

                <div className="hidden items-center justify-center gap-4 p-2.5 sm:flex xl:p-5">
                  <button
                    className="text-black dark:text-white"
                    onClick={() => handleEdit(group)}
                  >
                    <Edit2Icon />
                  </button>
                  <button
                    className="text-black dark:text-white"
                    onClick={() => {
                      setGroupToDelete(group);
                      setAlert2((prev) => ({ ...prev, isOpen: true }));
                    }}
                  >
                    <Trash2Icon />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <ResponsivePagination
        current={currentPage}
        total={Math.ceil(totalGroups / 10)}
        onPageChange={handlePageChange}
      />
      <Modal
        isOpen={alert2.isOpen}
        onSubmit={() => handleDelete(GroupToDelete)}
        onCancel={() => {
          setAlert2((prev) => ({ ...prev, isOpen: false }));
        }}
        alertTitle={"Delete Group"}
        alertDescription={
          `If you are sure, type the group name to confirm deletion.`
        }
        submitBtnName={"Delete"}
        cancelBtnName="Cancel"
        type="error"
        onClose={() => {
          setAlert2((prev) => ({ ...prev, isOpen: false }));
        }}
      >
        <div className="p-4">
          <div className="flex flex-col">
            <label htmlFor="deleteName" className="text-sm font-medium">
              Name:
            </label>
            <input
              id="deleteName"
              type="text"
              onChange={(event) =>
                setGroupToDelete({ ...GroupToDelete, name: event.target.value })
              }
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={`Type "${GroupToDelete?.name}"`}
            />
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={alert.isOpen}
        onSubmit={() => updateGroup(GroupToEdit)}
        onCancel={() => {
          setAlert((prev) => ({ ...prev, isOpen: false }));
        }}
        alertTitle={"Edit " + GroupToEdit?.name}
        alertDescription={"Edit the group's information"}
        submitBtnName={"Update"}
        cancelBtnName="Cancel"
        type="success"
        onClose={() => {
          setAlert((prev) => ({ ...prev, isOpen: false }));
        }}
      >
        <div className="p-4">
          <div className="flex flex-col">
            <label htmlFor="groupName" className="text-sm font-medium">
              Name:
            </label>
            <input
              id="groupName"
              type="text"
              value={GroupToEdit?.name || ""}
              onChange={(event) =>
                setGroupToEdit({ ...GroupToEdit, name: event.target.value })
              }
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <label htmlFor="groupEffectif" className="text-sm font-medium mt-4">
              Effectif:
            </label>
            <input
              id="groupEffectif"
              type="number"
              value={GroupToEdit?.Effectif || 0}
              onChange={(event) =>
                setGroupToEdit({
                  ...GroupToEdit,
                  Effectif: Number(event.target.value),
                })
              }
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default GroupsTable;

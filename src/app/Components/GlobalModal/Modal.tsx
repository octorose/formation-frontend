import { classNames } from "@/utils/cn";
import { Dialog, Transition } from "@headlessui/react";
import { DeleteIcon, Info, TrashIcon, XIcon } from "lucide-react";
// import {
//   ExclamationIcon,
//   InformationCircleIcon,
//   XIcon,
// } from "@heroicons/react/outline";
import { Fragment, useState } from "react";
import { FaExclamation } from "react-icons/fa";

export interface AlertProps {
  delete?: boolean;
  isOpen: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>> | undefined;
  type: "error" | "success" | "warning" | "info";
  alertTitle: string;
  alertDescription: string | React.ReactNode;
  cancelBtnName?: string;
  submitBtnName?: string;
  onCancel?: () => void | Promise<void>;
  onSubmit: () => void | Promise<void>;
  onClose?: () => void | Promise<void>;
  disableSubmitBtn?: boolean;
  disableCancelBtn?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export default function Modal({
  delete: _delete,
  isOpen,
  setIsOpen,
  type,
  alertDescription,
  alertTitle,
  onCancel,
  onSubmit,
  onClose,
  cancelBtnName,
  submitBtnName,
  disableSubmitBtn = false,
  disableCancelBtn = false,
  isLoading = false,
  children,
}: AlertProps) {
  const [typo, setType] = useState(type);
  return (
    // <section className="absolute inset-0 flex items-center justify-center bg-ft-lt/70">
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[60] "
        onClose={() => (onClose ? onClose() : setIsOpen?.(false))}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto ">
          <div className="flex min-h-full   items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-x-auto rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute top-4 text-gray-400 right-16 hover:text-red-600 hover:cursor-pointer h-1 w-1" onMouseEnter={()=>{setType("error")}} onMouseLeave={()=>{setType(type)}} >
                  <TrashIcon />
                </div>
                <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button
                    type="button"
                    disabled={isLoading}
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-0 focus:ring-indigo-500 focus:ring-offset-0"
                    onClick={() => {
                      onClose
                        ? onClose()
                        : //@ts-ignore
                          (setIsOpen?.(false) as AlertProps["setIsOpen"]);
                    }}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div
                    className={classNames(
                      "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10",
                      typo === "error"
                        ? "bg-red-100"
                        : typo === "success"
                        ? "bg-green-100"
                        : typo === "warning"
                        ? "bg-yellow-100"
                        : "bg-black/20"
                    )}
                  >
                    {typo === "error" ? (
                      <FaExclamation
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    ) : (
                      <Info className="h-6 w-6 text-black" aria-hidden="true" />
                    )}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-5/6">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {alertTitle}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {typeof alertDescription === "string"
                          ? alertDescription
                          : alertDescription}
                      </p>
                      {children}
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    disabled={disableSubmitBtn}
                    type="button"
                    className={classNames(
                      "min-w-[90px] inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed",
                      isLoading
                        ? "bg-ft-ts/70"
                        : typo === "error"
                        ? "bg-red-600"
                        : typo === "success"
                        ? "bg-green-600"
                        : typo === "warning"
                        ? "bg-yellow-600"
                        : "bg-black"
                    )}
                    onClick={onSubmit}
                  >
                    {isLoading ? (
                      <svg
                        className="animate-spin h-5 md:h-6 w-5 text-ft-lt"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      submitBtnName || "Confirm"
                    )}
                  </button>
                  {!disableCancelBtn && (
                    <button
                      disabled={disableCancelBtn}
                      type="button"
                      className="min-w-[90px] mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-indigo-500 focus:ring-offset-0 focus:ring-0 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        onCancel ? onCancel() : setIsOpen?.(false)
                      }
                    >
                      {cancelBtnName || "Cancel"}
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
    // </section>
  );
}

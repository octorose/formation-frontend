import { useState } from "react";
// import { AlertProps } from "./Alert";

// export interface AlertState {
//     isOpen: boolean;
//     isLoading: boolean;
//     type: "success" | "error" | "warning" | "info";
//     alertTitle: string;
//     alertDescription: string;
//     onSubmit: () => Promise<void> | void;
//     submitBtnName: string;
//     cancelBtnName: string;
//     disableCancelBtn: boolean;
//     disableSubmitBtn: boolean;
// }

export default function useAlert() {
  const [alert, setAlert] = useState({
    isOpen: false,
    isLoading: false,
    type: "error",
    alertTitle: "",
    alertDescription: "",
    cancelBtnName: "",
    submitBtnName: "",
    onCancel: () => setAlert({ ...alert, isOpen: false }),
    onSubmit: () => setAlert({ ...alert, isOpen: false }),
    onClose: () => setAlert({ ...alert, isOpen: false }),
    disableSubmitBtn: false,
    disableCancelBtn: false,
    link: "",
    linkprivate: "",
    walletName: "",
    walletAddress: "",
  });

  return {
    alert,
    setAlert,
  };
}

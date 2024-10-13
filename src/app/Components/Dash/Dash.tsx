import React from "react";
import { getRoleFromToken } from "@/utils/getRoleFromToken";
import RHDash from "./RHDash";
import SuperviseurDash from "./SuperviseurDash";
import ResponsableEcoleFormationDash from "./ResponsableEcoleFormationDash";
import FormateurDash from "./FormateurDash";
function Dash() {
  const userRole = getRoleFromToken();
  console.log(userRole);
  const renderDashboard = () => {
    switch (userRole) {
      case "RH":
        return <RHDash />;
      case "Superviseur":
        return <SuperviseurDash />;
      case "ResponsableEcoleFormation":
        return <ResponsableEcoleFormationDash />;
      case "Formateur":
        return <FormateurDash />;
      default:
        return <div>No dashboard available for this role.</div>;
    }
  };

  return <div>{renderDashboard()}</div>;
}

export default Dash;

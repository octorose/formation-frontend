"use client";

import { useEffect, useState } from "react";
import { getRoleFromToken } from "@/utils/getRoleFromToken";

const withAuth = (
  WrappedComponent: React.ComponentType,
  allowedRoles: string[]
) => {
  const Wrapper = (props: any) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);


    useEffect(() => {
      const checkAuth = () => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("access_token");
          if (!token) {
            // Redirect to login page if there is no token
            window.location.href = "/NotAllowed";
            setIsAuthorized(false);
          } else {
            const role = getRoleFromToken();
            if (!role || !allowedRoles.includes(role)) {
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              window.location.href = "/NotAllowed";
              setIsAuthorized(false);
            } else {
              setIsAuthorized(true);
            }
          }
        }
      };
      checkAuth();
    }, []);

    if (isAuthorized === null) {
      return <div>Loading...</div>;
    }

    return isAuthorized ? <WrappedComponent {...props} /> : null;
  };

  return Wrapper;
};

export default withAuth;

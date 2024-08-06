"use client";
// hoc/withAuth.tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getRoleFromToken } from "@/utils/getRoleFromToken";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
      null
    );

    useEffect(() => {
      const checkAuth = () => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("access_token");
          if (!token) {
            //redirect to login page if there is no token
            window.location.href = "/Signin";
            setIsAuthenticated(false);
          } else {
            const role = getRoleFromToken();
            if (!role) {
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              window.location.href = "/Signin";
              setIsAuthenticated(false);
            } else {
              setIsAuthenticated(true);
            }
          }
        }
      };
      checkAuth();
    }, []);

    if (isAuthenticated === null) {
      return <div>Loading...</div>; // Show a loading state while checking authentication
    }

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return Wrapper;
};

export default withAuth;

// components/ProtectedRoute.tsx
import React from "react";
import { useRouter } from "next/router";
import { useUser } from "@/Context/UserContext";

const ProtectedRoute = ({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles: string[];
}) => {
  const { role } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (role && !roles.includes(role)) {
      router.push("/"); // Redirect to home or a not authorized page
    }
  }, [role, router, roles]);

  if (!role || !roles.includes(role)) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

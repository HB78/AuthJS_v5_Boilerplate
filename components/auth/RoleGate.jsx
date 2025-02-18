"use client";

import { useCurrentRole } from "@/hooks/useCurrentRole";
import FormError from "./FormError";

const RoleGate = ({ children, allowedRole }) => {
  const role = useCurrentRole();
  console.log("useCurrentRole:ROLE GATE", role);

  if (role !== allowedRole) {
    return (
      <FormError message="You are not authorized to access this content" />
    );
  }
  return <>{children}</>;
};

export default RoleGate;

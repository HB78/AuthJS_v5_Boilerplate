import { useSession } from "next-auth/react";

export const useCurrentRole = () => {
  const session = useSession();
  console.log("session:ROLE USECURRENTROLE", session);

  return session.data?.user?.role;
};

"use client";

import { signOut } from "next-auth/react";

const LogOutButton = ({ children }) => {
  const handleSignOut = () => {
    signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  return (
    <span onClick={handleSignOut} className="cursor-pointer">
      {children}
    </span>
  );
};

export default LogOutButton;

"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserButton from "../../../components/auth/UserButton";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm">
      <div className="flex gap-x-2"></div>
      <Button variant={pathname === "/server" ? "default" : "outline"}>
        <Link href={"server"}>Server</Link>
      </Button>{" "}
      <Button variant={pathname === "/client" ? "default" : "outline"}>
        <Link href={"client"}>Client</Link>
      </Button>{" "}
      <Button variant={pathname === "/admin" ? "default" : "outline"}>
        <Link href={"admin"}>Admin</Link>
      </Button>{" "}
      <Button variant={pathname === "/settings" ? "default" : "outline"}>
        <Link href={"settings"}>Settings</Link>
      </Button>{" "}
      <UserButton />
    </nav>
  );
};

export default Navbar;

"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import LoginForm from "../auth/LoginForm";

const LoginButton = ({ children, mode = "redirect" }) => {
  const router = useRouter();

  const onClickFunction = () => {
    router.push("/auth/login");
  };

  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="cursor-pointer">{children}</div>
        </DialogTrigger>
        <DialogContent className="w-full bg-transparent border-none flex items-center justify-center">
        <DialogTitle className="hidden">title</DialogTitle>
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div onClick={onClickFunction} mode={"modal"} className="cursor-pointer">
      {children}
    </div>
  );
};

export default LoginButton;

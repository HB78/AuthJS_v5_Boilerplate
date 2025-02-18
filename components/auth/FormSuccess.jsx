import { CircleCheckBig } from "lucide-react";
import React from "react";

const FormSuccess = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
      <CircleCheckBig className="w-5 h-5" />
      <p>{message}</p>
    </div>
  );
};

export default FormSuccess;

import { TriangleAlert } from "lucide-react";
import React from "react";

const FormError = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
      <TriangleAlert className="w-5 h-5" />
      <p>{message}</p>
    </div>
  );
};

export default FormError;

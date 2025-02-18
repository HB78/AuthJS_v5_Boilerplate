import { TriangleAlert } from "lucide-react";
import React from "react";
import CardWrapper from "./CardWrapper";

const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="oops something went wrong"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="w-full flex justify-center items-center">
        <TriangleAlert className="w-5 h-5 text-destructive" />
      </div>
    </CardWrapper>
  );
};

export default ErrorCard;

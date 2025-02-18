"use client";

import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { verificationTokenValidityAction } from "./../../actions/auth/verificationAction";
import CardWrapper from "./CardWrapper";
import FormError from "./FormError";
import FormSuccess from "./FormSuccess";

const VerificationTokenForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    try {
      if (!token) {
        setError("missing token");
      }
      if (success || error) {
        return;
      }
      await verificationTokenValidityAction(token);
      setSuccess("token is valid");
    } catch (error) {
      setError("error from server action ValidityAction");
      console.log("error:", error);
    }
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      backButtonHref="/auth/login"
      headerLabel="Confirm your identification"
      backButtonLabel="Back to login"
    >
      <div className="w-full flex justify-center items-center">
        {!success && !error && (
          <Loader2 className="animate-spin-slow h-5 w-5" />
        )}

        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
};

export default VerificationTokenForm;

"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { newPasswordAction } from "./../../actions/auth/newPassword";
import { NewPasswordSchema } from "./../../schema";
import CardWrapper from "./CardWrapper";
import FormError from "./FormError";

const NewPasswordForm = () => {
  const params = useSearchParams();
  const token = params.get("token");

  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState("");

  const form = useForm({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const handleSubmit = (data) => {
    setError("");
    startTransition(async () => {
      try {
        const result = await newPasswordAction(data, token); // Appelle l'action avec les données du formulaire
        console.log("result:", result);
        if (result?.error) {
          setError(result?.error);
        } else if (result?.success) {
          toast.success(result?.success);
          form.reset();
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred. Please try again zut.");
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Enter a new password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      {!token ? (
        <p className="text-center font-bold">
          Please Check your email and come back
        </p>
      ) : (
        <Form {...form}>
          <form
            action={form.handleSubmit(handleSubmit)}
            className="space-y-6 h-full"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="******"
                          type="password"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <FormError message={error} />
            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              variant={isPending ? "ghost" : "default"}
            >
              Reset password
            </Button>
          </form>
        </Form>
      )}
    </CardWrapper>
  );
};

export default NewPasswordForm;

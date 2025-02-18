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
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ResetPasswordAction } from "./../../actions/auth/ResetPasswordSchema";
import { ResetPasswordSchema } from "./../../schema";
import CardWrapper from "./CardWrapper";
import FormError from "./FormError";

const ResetForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const form = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = (data) => {
    setError("");
    startTransition(async () => {
      try {
        const result = await ResetPasswordAction(data); // Appelle l'action avec les données du formulaire
        console.log("result:", result);
        if (result.error) {
          setError(result.error);
        } else if (result.success) {
          toast.success(result.success);
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
      headerLabel="Forgot your password ?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form
          action={form.handleSubmit(handleSubmit)}
          className="space-y-6 h-full"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        {...field}
                        placeholder="email@example.com"
                        type="email"
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
            Send reset password email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetForm;

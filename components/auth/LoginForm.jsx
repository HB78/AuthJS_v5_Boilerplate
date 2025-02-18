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
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginAction } from "./../../actions/auth/login";
import { LoginSchema } from "./../../schema";
import CardWrapper from "./CardWrapper";
import FormError from "./FormError";

const LoginForm = () => {
  const params = useSearchParams();
  const urlError =
    params.get("error") === "OAuthAccountNotLinked"
      ? "email already use with another provider"
      : "";

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  // const [magicLinkSent, setMagicLinkSent] = useState(false);

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  // const magicLinkForm = useForm({
  //   resolver: zodResolver(magicLinkSchema),
  //   defaultValues: {
  //     email: "",
  //   },
  // });

  const handleSubmit = (data) => {
    setError("");
    startTransition(async () => {
      try {
        const result = await loginAction(data);

        if (result.twoFactor) {
          setShowTwoFactor(true);
          toast.success("Two-factor authentication required");
        } else if (result.success) {
          const logIn = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirectTo: "/settings",
          });

          if (logIn?.error) {
            setError(logIn.error);
            return;
          }
          toast.success(result.success);
        } else if (result.error) {
          setError(result.error);
        }
      } catch (error) {
        console.error("Login error:", error);
        setError("An unexpected error occurred");
      }
    });
  };

  // const handleMagicLinkSubmit = async (data) => {
  //   try {
  //     setError("");
  //     const result = await signIn("resend", {
  //       email: data?.email,
  //       redirectTo: "/settings",
  //     });

  //     if (result?.error) {
  //       setError(result.error);
  //       return;
  //     }

  //     setMagicLinkSent(true);
  //     toast.success("Magic link sent! Check your email");
  //   } catch (error) {
  //     console.error("Magic link error:", error);
  //     setError("Failed to send magic link");
  //   }
  // };

  // Il faut créer une page avec ce composant et faire un router.push dans la fonction handleMagicLinkSubmit si success
  // if (magicLinkSent) {
  //   return (
  //     <CardWrapper
  //       headerLabel="Check your email"
  //       backButtonLabel="Back to login"
  //       backButtonHref="/auth/login"
  //     >
  //       <div className="flex flex-col items-center space-y-4">
  //         <p className="text-muted-foreground text-center">
  //           We have sent you a magic link. Check your email to sign in.
  //         </p>
  //       </div>
  //     </CardWrapper>
  //   );
  // }

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <div className="space-y-2">
        {/* Formulaire de connexion existant */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending || showTwoFactor}
                      placeholder="email@example.com"
                      type="email"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!showTwoFactor && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type="password"
                        placeholder="your password"
                        className="w-full"
                      />
                    </FormControl>
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0 font-normal"
                      asChild
                    >
                      <Link href="/auth/reset">Forgot password?</Link>
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two-Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="123456"
                        className="w-full"
                        maxLength={6}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormError message={error || urlError} />

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              variant={isPending ? "ghost" : "default"}
            >
              {showTwoFactor ? "Confirm" : "Login"}
            </Button>
          </form>
        </Form>

        {/* Séparateur */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <hr />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* Formulaire Magic Link */}
        {/* <Form {...magicLinkForm}>
          <form
            action={magicLinkForm.handleSubmit(handleMagicLinkSubmit)}
            className="space-y-3"
          >
            <FormField
              control={magicLinkForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="email@example.com"
                      type="email"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              variant="outline"
            >
              Continue with Magic Link
            </Button>
          </form>
        </Form> */}
      </div>
    </CardWrapper>
  );
};

export default LoginForm;

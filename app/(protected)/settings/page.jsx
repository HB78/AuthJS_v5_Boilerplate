"use client";

import { updateUserInfo } from "@/actions/auth/updateUserInfo";
import FormError from "@/components/auth/FormError";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { SettingsSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { userRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Home() {
  // pour update la session cote client on appelle usesession
  const user = useCurrentUser();
  const { update } = useSession();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  //LE probleme liée au update raté du user avec github venait d'ici, il fallait faire un rendu conditionnel
  const form = useForm({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || "",
      role: user?.role || undefined,
      // Ne pas inclure les champs suivants pour les utilisateurs OAuth
      ...(user?.isOAuth === false && {
        email: user?.email || "",
        password: "",
        newPassword: "",
        isTwoFactorEnabled: user?.isTwoFactorEnabled || false,
      }),
    },
  });

  const handleUpdateUserInfos = async (values) => {
    startTransition(async () => {
      setError("");
      try {
        const result = await updateUserInfo(values);
        console.log("Update result:", result);

        if (result?.error) {
          setError(result.error);
        }
        if (result?.success) {
          update();
          toast.success(result.success);
        }
        // la fonction update suffit a mettre a jour la session cote client
      } catch (error) {
        console.log("error:update name client", error);
        setError("error: something went wrong");
      }
    });
  };

  return (
    <main className="flex h-screen flex-col items-center justify-evenly">
      <Card className="w-[600px] shadow-md">
        <CardHeader>
          <p className="text-2xl font-semibold text-center">📖 Settings</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              action={form.handleSubmit(handleUpdateUserInfos)}
              className="space-y-1"
            >
              <div className="space-y-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            {...field}
                            placeholder="John Doe"
                            // className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                {user?.isOAuth === false && (
                  <>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                disabled={isPending}
                                {...field}
                                placeholder="JohnDoe@gmail.com"
                                // className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                disabled={isPending}
                                {...field}
                                placeholder="*******"
                                // className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>New password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                disabled={isPending}
                                {...field}
                                placeholder="*******"
                                // className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </>
                )}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          disabled={isPending}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={userRole.ADMIN}>
                              Admin
                            </SelectItem>
                            <SelectItem value={userRole.USER}>User</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                {user?.isOAuth === false && (
                  <FormField
                    control={form.control}
                    name="isTwoFactorEnabled"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Two factor code</FormLabel>
                            <FormDescription>
                              Enable two factor authentication for your account.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              disabled={isPending}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                )}
              </div>
              <FormError message={error} />
              <Button
                type="submit"
                className="w-full"
                disabled={isPending}
                variant={isPending ? "ghost" : "default"}
              >
                {isPending ? "Saving..." : "Save"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}

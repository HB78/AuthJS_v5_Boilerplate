"use client";

import { isAdminUser } from "@/actions/auth/isAdminUser";
import FormSuccess from "@/components/auth/FormSuccess";
import RoleGate from "@/components/auth/RoleGate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { userRole } from "@prisma/client";
import { toast } from "sonner";

export default function Home() {
  const onAPIRouteClick = async () => {
    try {
      const response = await fetch("/api/admin");
      if (response.ok) {
        return toast.success("Allowed to access this API route");
      }
      return toast.error("Forbidden to access this API route");
    } catch (error) {
      console.log("error:", error);
    }
  };
  const onServerActionClick = async () => {
    try {
      const response = await isAdminUser();
      if (response.error) {
        return toast.error("Not allowed to access this API route");
      }

      return toast.success("Authorized to access this API route");
    } catch (error) {
      console.log("error:", error);
    }
  };

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <Card className="w-[600px] shadow-md">
        <CardHeader>
          <p className="text-2xl font-semibold text-center">🔑 Admin</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* on peut aller chercher le role directement dans la bdd grace a prisma client */}
          <RoleGate allowedRole={userRole?.ADMIN}>
            <FormSuccess message="You are authorized to access this content" />
          </RoleGate>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <p className="text-sm font-medium">Admin only API route</p>
            <Button onClick={onAPIRouteClick}>Click to test</Button>
          </div>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <p className="text-sm font-medium">Admin only server action</p>
            <Button onClick={onServerActionClick}>Click to test</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

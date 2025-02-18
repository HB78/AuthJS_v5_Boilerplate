"use server";

import { getCurrentUserFromServer } from "@/tools/getServerSession";
import { userRole } from "@prisma/client";

export async function isAdminUser() {
  const user = await getCurrentUserFromServer();

  if (user?.role === userRole.ADMIN) {
    return { success: "Authorized as admin user" };
  }
  return { error: "Not authorized as admin user" };
}

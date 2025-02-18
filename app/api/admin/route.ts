import { getCurrentRoleFromServer } from "@/tools/getServerSession";
import { userRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const role = await getCurrentRoleFromServer();
  try {
    if (role === userRole.ADMIN) {
      return new NextResponse(null, { status: 200 });
    }
    return NextResponse.json("Forbidden to access this API route", {
      status: 403,
    });
  } catch (error) {
    console.log("error:", error);
  }

  return new NextResponse(null, { status: 403 });
}

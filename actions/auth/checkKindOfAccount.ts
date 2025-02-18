"use server";

import { prisma } from "@/lib/db";
//ici on va checker quel type de compte le user possède
//en effet on ne va pas permettre au user de update un mdp si il possède un compte Google

export const checkKindOfAccount = async (userId: string) => {
  try {
    const account = await prisma.account.findFirst({
      where: { userId },
    });
    return account;
  } catch (error) {
    console.log("error:", error);
    return null;
  }
};

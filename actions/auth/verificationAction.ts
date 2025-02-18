"use server";

import { prisma } from "@/lib/db";
import { getUserByEmail } from "@/tools/users";
import { verificationTokenByToken } from "@/tools/verificationToken";

export const verificationTokenValidityAction = async (token: string) => {
  const existingToken = await verificationTokenByToken(token);

  if (!existingToken) {
    return { error: "invalid token, no token found" };
  }

  const hasEpiredToken = new Date() > new Date(existingToken.expires);

  if (hasEpiredToken) {
    return { error: "token has expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "invalid token, no email found" };
  }

  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingUser.email,
    },
  });

  //on efface le token de verification car on en a plus besoin
  //maintenant qu'on a verifié la validité du token on peut utiliser son id
  await prisma.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "token is valid" };
};

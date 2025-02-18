"use server";

import { prisma } from "@/lib/db";
import { getPasswordResetTokenByToken } from "@/tools/passwordResetToken";
import { getUserByEmail } from "@/tools/users";
import bcrypt from "bcrypt";
import * as z from "zod";
import { NewPasswordSchema } from "../../schema";

export const newPasswordAction = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "token not found" };
  }
  const validateFields = NewPasswordSchema.safeParse(values);
  if (!validateFields.success) {
    return {
      error: "Invalid fields",
      status: 400,
    };
  }

  const { password } = validateFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "invalid token or no token found" };
  }

  const hasExpiredToken = new Date() > new Date(existingToken.expires);

  if (hasExpiredToken) {
    return { error: "token has expired" };
  }

  // on verifie que le user qui veut modifier son mdp existe
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "user not found" };
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      password: hashedPassword,
    },
  });
  //on efface le token de reset car on en a plus besoin
  await prisma.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "password is updated", status: 201 };
};

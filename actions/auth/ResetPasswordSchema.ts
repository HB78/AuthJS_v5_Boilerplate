/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/tools/token";
import { getUserByEmail } from "@/tools/users";
import * as z from "zod";
import { ResetPasswordSchema } from "../../schema";

export const ResetPasswordAction = async (
  values: z.infer<typeof ResetPasswordSchema>
) => {
  const validateFields = ResetPasswordSchema.safeParse(values);

  if (!validateFields.success) {
    return {
      error: "Invalid fields",
      status: 400,
    };
  }

  const { email } = validateFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { error: "email not found", status: 400 };
  }
  const passwordReseToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordReseToken.email,
    passwordReseToken.token
  );
  return { success: "email is sended", status: 201 };
};

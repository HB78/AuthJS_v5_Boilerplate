/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { prisma } from "@/lib/db";
import { sendEmailVerification } from "@/lib/mail";
import { generateVerificationToken } from "@/tools/token";
import bcrypt from "bcrypt";
import * as z from "zod";
import { RegisterSchema } from "../../schema";

export const RegisterAction = async (
  values: z.infer<typeof RegisterSchema>
) => {
  const validateFields = RegisterSchema.safeParse(values);

  if (!validateFields.success) {
    return {
      error: "Invalid fields",
      details: validateFields.error.errors,
      status: 400,
    };
  }

  const { email, password, name } = validateFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: { email: true },
    });

    if (existingUser) {
      return { error: "email already exists", status: 400 };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    // On crée un token de vérification
    const verificationToken = await generateVerificationToken(email);
    console.log("verificationToken:", verificationToken);

    // On envoie un email de vérification
    await sendEmailVerification(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "email confirmation sent", status: 201 };
  } catch (error) {
    console.log("error:", error);
    return { error: "error from server action register", status: 500 };
  }
};

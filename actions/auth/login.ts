"use server";

import { prisma } from "@/lib/db";
import { sendEmailVerification, sendTwoFactorTokenEmail } from "@/lib/mail";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/tools/token";
import { getTwoFactorConfirmationByUserId } from "@/tools/twoFactorConfirmation";
import { getTwoFactorTokenByEmail } from "@/tools/twoFactorToken";
import { getUserByEmail } from "@/tools/users";
import { verifyPasswordValidity } from "@/tools/verificationToken";
import * as z from "zod";
import { LoginSchema } from "../../schema";

export const loginAction = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "invalidate fields" };
  }
  const { email, password, code } = validateFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "invalid credentials no existing user" };
  }

  const verifyPassword = await verifyPasswordValidity(password, email);

  if (verifyPassword && verifyPassword.error) {
    return { error: verifyPassword.error }; // Si le mot de passe est invalide, renvoyer une erreur
  }

  // un IF assez long pour au cas ou le user n'est pas encore vérifié
  // Si le user n'est pas encore vérifié, on génère un token de vérification et on envoit un email
  if (!existingUser.emailVerified) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const verificationToken = await generateVerificationToken(email);

    if (
      !verificationToken ||
      !verificationToken.email ||
      !verificationToken.token
    ) {
      return {
        error:
          "Unable to generate verification token, token not generated successfully",
      };
    }

    await sendEmailVerification(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "confirmation email sent" };
  }

  //bon la on a vérifié si le user est verifié plus haut
  //occupons nous du 2FA lors du login
  //on fait la gestion du code otp si il existe on l'utilise sinon on l'envoie
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      //on va chercher le code créer et stocker dans la BDD
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return { error: "no code factor found or code invalid" };
      }
      if (twoFactorToken.token !== code) {
        return { error: "Invalide code check your email" };
      }
      const hasEpired = new Date(twoFactorToken.expires) < new Date();
      if (hasEpired) {
        return { error: "Code expired !" };
      }

      //si il y a un code dans la bdd au moment du signIn et qu'il est bon
      //on l'efface d'une part le token de confirmation et d'autre part la confirmation
      //on crée une nouvelle confirmation pour le user
      //Donc un code ne pourra etre utilisé qu'une seule fois
      await prisma.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );
      if (existingConfirmation) {
        //c'est ici qu'il faudrait ajouter une expiration de la confirmation de la 2FA
        await prisma.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }
      await prisma.twoFactorConfirmation.create({
        data: { userId: existingUser.id },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true, success: "2FA email sent" };
    }
  }

  return { success: "Logged in successfully", status: 200 };
};

// Au sujet du code et du if else general
//quand on se log la 1er fois il n'y a pas de code par defaut donc on entre dans le else
//quand on se log la 2eme fois il y a un code par defaut donc on entre dans le if

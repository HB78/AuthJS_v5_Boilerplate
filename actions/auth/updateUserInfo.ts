"use server";

import { prisma } from "@/lib/db";
import { sendEmailVerification } from "@/lib/mail";
import { SettingsSchema } from "@/schema";
import { getCurrentUserFromServer } from "@/tools/getServerSession";
import { generateVerificationToken } from "@/tools/token";
import { getUserByEmail, getUserById } from "@/tools/users";
import bcrypt from "bcrypt";
import * as z from "zod";

export const updateUserInfo = async (
  values: z.infer<typeof SettingsSchema>
) => {
  console.log("Server action called with values:", values);

  const user = await getCurrentUserFromServer();
  console.log("user:je teste le user dans la bdd", user);

  if (!user) {
    return { error: "Not authorized" };
  }

  //on verifie que le user existe dans la base de données
  const existingUser = await getUserById(user.id);

  if (!existingUser) {
    return { error: "not authorized" };
  }

  if (user?.id !== existingUser.id) {
    return { error: "not authorized not your account" };
  }

  //si il est un utilisateur OAuth on ne peut pas modifier ses informations
  if (user?.isOAuth) {
    // values.email = undefined;
    // values.newPassword = undefined;
    // values.password = undefined;
    // values.isTwoFactorEnabled = undefined;
    values = {
      name: values.name,
      role: values.role,
    };
  }

  //si le user modifie son email on block si le nouveau mail existe deja
  if (values.email && values.email !== existingUser.email) {
    const existingUserByEmail = await getUserByEmail(values.email);
    if (existingUserByEmail && existingUserByEmail.id !== existingUser.id) {
      return { error: "email already exists", status: 400 };
    }
    // quand on change son email on envoie un email de verification
    const verificationToken = await generateVerificationToken(values.email);
    await sendEmailVerification(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "email confirmation sent", status: 200 };
  }

  //on s'occuppe du password, on verifie que le user a un password cad un credential compte
  //on verifie aussi que le user a entré un nouveau password
  //je ne savais pas mais on peut comparer le password et le newpassword avec bcrypt.compare
  // En fait le user ne peut pas changer de mdp sans entrer l'ancien mdp
  // values.password c'est l'ancien mot de passe et on verifie qu'il est bon avec bcrypt.compare

  if (values.password && values.newPassword && existingUser.password) {
    // on verifie que le user a entré l'ancien mdp et le nouveau et qu'il a un mdp dans la BDD
    const hashedPassword = await bcrypt.compare(
      values.password,
      existingUser.password
    );
    if (!hashedPassword) {
      return { error: "Incorrect password", status: 400 };
    }
    const hashedNewPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedNewPassword;
    values.newPassword = undefined;
  }

  // Si l'utilisateur ne veut pas changer son mot de passe, on ignore la vérification
  // si on veut que le user entre le mdp pour changer toutes ses infos on enleve ce if
  if (!values.password && !values.newPassword) {
    // Tu peux simplement ne pas toucher aux champs de mot de passe
    values.password = undefined;
    values.newPassword = undefined;
  }

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { ...values },
  });

  return { success: "User info updated", userUpdated: existingUser };
};

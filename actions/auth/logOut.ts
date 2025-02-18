"use server";

import { signOut } from "@/lib/auth";

// je peux faire un log out ici cote server et l'utiliser dans le client
//C'est utile lorsque que je veux effectuer des action dans le back avant le log out
//par contre j'importe le logout depuis auth et non depuis next/react

// ATTENTION : ce n'est pas un composant mais un action qui est exécuté en back cad une fonction exportée
export const logOutAction = async () => {
  //some stuff in server
  await signOut;
};

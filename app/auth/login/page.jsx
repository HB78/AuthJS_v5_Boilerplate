import { auth } from "@/lib/auth";
import LoginForm from "../../../components/auth/LoginForm";

export default async function Home() {
  const session = await auth();
  console.log("session:hicham", session);
  return (
    <main className="flex w-full h-screen flex-col items-center justify-center">
      <LoginForm />
    </main>
  );
}

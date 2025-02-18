import RegisterForm from "../../../components/auth/RegisterForm";

export default async function Home() {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center">
      <RegisterForm />
    </main>
  );
}

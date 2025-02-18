import VerificationTokenForm from "./../../../components/auth/VerificationTokenForm";

export default async function Home() {
  return (
    <main className="h-screen flex flex-col items-center justify-center">
      <VerificationTokenForm />
    </main>
  );
}

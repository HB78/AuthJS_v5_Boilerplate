import ErrorCard from "../../../components/auth/ErrorCard";

export default async function Home() {
  return (
    <main className="h-screen flex flex-col items-center justify-center">
      <ErrorCard />
    </main>
  );
}

import UserInfo from "@/components/UserInfo";
import { getCurrentUserFromServer } from "@/tools/getServerSession";

export default async function Home() {
  const user = await getCurrentUserFromServer();

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <UserInfo user={user} label="💻 Server component" />
    </main>
  );
}

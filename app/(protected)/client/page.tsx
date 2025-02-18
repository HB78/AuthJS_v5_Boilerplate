"use client";

import UserInfo from "@/components/UserInfo";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function Home() {
  const user = useCurrentUser();

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <UserInfo user={user} label="📴 Client component" />
    </main>
  );
}

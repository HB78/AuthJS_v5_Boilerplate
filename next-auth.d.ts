// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { userRole } from "@prisma/client";

// export type ExtendedUser = DefaultSession["user"] & {
//   role: userRole;
// };

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: userRole;
      isTwoFactorEnabled: boolean;
      isOAuth: boolean;
    };
  }
}

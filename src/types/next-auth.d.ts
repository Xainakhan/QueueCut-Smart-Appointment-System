import "next-auth";
import type { DefaultSession } from "next-auth";
declare module "next-auth" { interface User { role: "owner" | "staff"; shopId: string } interface Session { user: { id: string; role: "owner" | "staff"; shopId: string } & DefaultSession["user"] } }
declare module "next-auth/jwt" { interface JWT { role?: "owner" | "staff"; shopId?: string } }

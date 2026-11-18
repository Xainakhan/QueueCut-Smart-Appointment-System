import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyPassword } from "@/server/passwords";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [Credentials({ credentials: { email: {}, password: {} }, authorize: async credentials => {
    if (typeof credentials.email !== "string" || typeof credentials.password !== "string") return null;
    const user = await db.query.users.findFirst({ where: eq(users.email, credentials.email) });
    if (!user || !(await verifyPassword(credentials.password, user.passwordHash))) return null;
    return { id: user.id, name: user.name, email: user.email, role: user.role, shopId: user.shopId };
  } })],
  callbacks: { jwt: ({ token, user }) => ({ ...token, role: user?.role ?? token.role, shopId: user?.shopId ?? token.shopId }), session: ({ session, token }) => ({ ...session, user: { ...session.user, id: token.sub!, role: token.role as "owner" | "staff", shopId: token.shopId as string } }) },
  pages: { signIn: "/login" }
});

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className="auth"><form action={async (form) => { "use server"; try { await signIn("credentials", { email: form.get("email"), password: form.get("password"), redirectTo: "/admin" }) } catch (e) { if (e instanceof AuthError) redirect("/login?error=1"); throw e } }}>
    <p className="badge">QUEUECUT ADMIN</p><h1>Team portal</h1>
    <p className="auth__help">For shop owners and team members. Customers can book without an account.</p>
    {error && <p className="notice" role="alert">Wrong email or password.</p>}
    <label>Email<input type="email" name="email" required autoFocus /></label>
    <label>Password<input type="password" name="password" required /></label>
    <button className="button">Sign in →</button>
  </form></main>;
}

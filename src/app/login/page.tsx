import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className="auth"><form action={async (form) => { "use server"; try { await signIn("credentials", { email: form.get("email"), password: form.get("password"), redirectTo: "/admin" }) } catch (e) { if (e instanceof AuthError) redirect("/login?error=1"); throw e } }}>
    <h1>Login</h1>
    {error && <p className="notice" role="alert">Wrong email or password.</p>}
    <label>Email<input type="email" name="email" required autoFocus /></label>
    <label>Password<input type="password" name="password" required /></label>
    <button className="button">Sign in →</button>
  </form></main>;
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth(request => {
  const user = request.auth?.user;
  if (!user) return NextResponse.redirect(new URL("/login", request.url));
  if (request.nextUrl.pathname.startsWith("/owner") && user.role !== "owner") return NextResponse.redirect(new URL("/dashboard/queue", request.url));
  return NextResponse.next();
});

export const config = { matcher: ["/owner/:path*", "/dashboard/:path*", "/admin/:path*"] };

import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth(request => {
  const legacyShop=request.nextUrl.pathname.match(/^\/s\/([^/]+)$/);
  if(legacyShop)return NextResponse.redirect(new URL(`/${legacyShop[1]}/book`,request.url),308);
  const legacyTicket=request.nextUrl.pathname.match(/^\/t\/([^/]+)$/);
  if(legacyTicket)return NextResponse.redirect(new URL(`/ticket/${legacyTicket[1]}`,request.url),308);
  const user = request.auth?.user;
  if (!user) return NextResponse.redirect(new URL("/login", request.url));
  if (request.nextUrl.pathname.startsWith("/owner") && user.role !== "owner") return NextResponse.redirect(new URL("/dashboard/queue", request.url));
  return NextResponse.next();
});

export const config = { matcher: ["/owner/:path*", "/dashboard/:path*", "/admin/:path*", "/s/:path*", "/t/:path*"] };

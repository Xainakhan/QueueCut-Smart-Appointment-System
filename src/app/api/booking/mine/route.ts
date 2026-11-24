import { and,eq,inArray } from "drizzle-orm";
import { NextRequest,NextResponse } from "next/server";
import { db } from "@/db";
import { bookings,bookingServices,customers,shops } from "@/db/schema";

export async function GET(request:NextRequest){
  const shopSlug=request.nextUrl.searchParams.get("shop")?.trim();
  const phone=request.nextUrl.searchParams.get("phone")?.trim();
  if(!shopSlug||!phone)return NextResponse.json({error:"missing_details"},{status:400});
  const shop=await db.query.shops.findFirst({where:eq(shops.slug,shopSlug)});
  const customer=await db.query.customers.findFirst({where:eq(customers.phone,phone)});
  if(!shop||!customer)return NextResponse.json([]);
  const items=await db.query.bookings.findMany({where:and(eq(bookings.shopId,shop.id),eq(bookings.customerId,customer.id),inArray(bookings.status,["confirmed","in_progress","done","no_show"]))});
  const services=items.length?await db.query.bookingServices.findMany({where:inArray(bookingServices.bookingId,items.map(item=>item.id))}):[];
  return NextResponse.json(items.sort((a,b)=>b.startAt.getTime()-a.startAt.getTime()).map(item=>({ticketNumber:item.ticketNumber,ticketToken:item.ticketToken,startAt:item.startAt.toISOString(),status:item.status,services:services.filter(service=>service.bookingId===item.id).map(service=>service.serviceName)})));
}

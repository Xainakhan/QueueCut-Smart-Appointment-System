import { NextRequest,NextResponse } from "next/server";import { confirmBooking,BookingError } from "@/server/booking";
export async function POST(r:NextRequest){try{const body=await r.json();return NextResponse.json(await confirmBooking(body.bookingId,body.name,body.phone))}catch(e){return NextResponse.json({error:e instanceof BookingError?e.code:"invalid_request"},{status:400})}}

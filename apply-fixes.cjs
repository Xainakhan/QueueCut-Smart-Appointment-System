const fs=require("fs"),path=require("path");
const REPLACEMENTS=[
 {"file":"src/app/api/shops/[shopId]/events/route.ts","old":"queue-changed\\\\ndata: {}\\\\n\\\\n","new":"queue-changed\\ndata: {}\\n\\n"},
 {"file":"src/app/api/shops/[shopId]/events/route.ts","old":"\": ping\\\\n\\\\n\"","new":"\": ping\\n\\n\""},
 {"file":"src/app/api/booking/confirm/route.ts","old":"confirmBooking(body.bookingId,body.phone)","new":"confirmBooking(body.bookingId,body.token)"},
 {"file":"src/server/booking/index.ts","old":"import { availableSlots, type Slot } from \"@/lib/scheduling/slot-engine\";","new":"import { availableSlots, type Slot } from \"@/lib/scheduling/slot-engine\";import { readVerification } from \"@/server/otp\";"},
 {"file":"src/server/booking/index.ts","old":"export async function confirmBooking(bookingId:string,phone:string){const id=z.string().uuid().parse(bookingId);const customer=await db.query.customers.findFirst({where:eq(customers.phone,phone)});","new":"export async function confirmBooking(bookingId:string,token:string){const id=z.string().uuid().parse(bookingId);const customerId=readVerification(token);if(!customerId)throw new BookingError(\"not_verified\");const customer=await db.query.customers.findFirst({where:eq(customers.id,customerId)});"},
 {"file":"src/server/booking/index.ts","old":"const c=await context(input);try{const [hold]","new":"const c=await context(input);await db.update(bookings).set({status:\"cancelled\"}).where(and(eq(bookings.staffId,matched.staffId),eq(bookings.status,\"held\"),lt(bookings.holdExpiresAt,new Date())));try{const [hold]"},
 {"file":"src/server/booking/index.ts","old":"const [confirmed]=await db.update(bookings).set({customerId:customer.id,status:\"confirmed\",ticketNumber:ticket,holdExpiresAt:null}).where(and(eq(bookings.id,id),eq(bookings.status,\"held\"),gte(bookings.holdExpiresAt,new Date()))).returning();if(!confirmed)throw new BookingError(\"slot_taken\");return confirmed;}","new":"let confirmed;for(let n=0;n<4&&!confirmed;n++){try{[confirmed]=await db.update(bookings).set({customerId:customer.id,status:\"confirmed\",ticketNumber:n?`${ticket}-${n}`:ticket,holdExpiresAt:null}).where(and(eq(bookings.id,id),eq(bookings.status,\"held\"),gte(bookings.holdExpiresAt,new Date()))).returning();break}catch(error){if((error as {code?:string}).code!==\"23505\"||n===3)throw error}}if(!confirmed)throw new BookingError(\"slot_taken\");return confirmed;}"},
 {"file":"src/app/s/[shopSlug]/portal.tsx","old":"[verified,setVerified]=useState(false),","new":"[verified,setVerified]=useState(false),[token,setToken]=useState(\"\"),"},
 {"file":"src/app/s/[shopSlug]/portal.tsx","old":"if(code)setVerified(true);else","new":"if(code){setToken((await r.json()).verificationToken);setVerified(true)}else"},
 {"file":"src/app/s/[shopSlug]/portal.tsx","old":"JSON.stringify({bookingId:hold.id,phone})","new":"JSON.stringify({bookingId:hold.id,token})"},
 {"file":"src/server/booking/operations.integration.test.ts","old":"confirmBooking(hold.id,customer.phone),confirmBooking(hold.id,customer.phone)","new":"confirmBooking(hold.id,signVerification(customer.id)),confirmBooking(hold.id,signVerification(customer.id))"},
 {"file":"src/server/booking/operations.integration.test.ts","old":"import {queueEvents}from\"@/server/events\";","new":"import {queueEvents}from\"@/server/events\";import {signVerification}from\"@/server/otp\";"},
 {"file":"src/server/booking/operations.ts","old":"import {and,eq,gte,inArray,lt}","new":"import {and,eq,gt,gte,inArray,lt}"},
 {"file":"src/server/booking/operations.ts","old":"gte(bookings.endAt,b.offeredStartAt)","new":"gt(bookings.endAt,b.offeredStartAt)"},
 {"file":"src/server/booking/operations.ts","old":"const [updated]=await db.update(bookings).set({startAt:b.offeredStartAt,endAt:end,offeredStartAt:null}).where(eq(bookings.id,b.id)).returning();queueEvents.publish(b.shopId);return updated;}","new":"let updated;try{[updated]=await db.update(bookings).set({startAt:b.offeredStartAt,endAt:end,offeredStartAt:null}).where(and(eq(bookings.id,b.id),eq(bookings.status,\"confirmed\"))).returning()}catch(error){if((error as {code?:string}).code===\"23P01\")throw new OperationError(\"slot_taken\");throw error}if(!updated)throw new OperationError(\"invalid_transition\");queueEvents.publish(b.shopId);return updated;}"},
 {"file":"src/app/dashboard/queue/page.tsx","old":"import {and,eq,gte,lt} from \"drizzle-orm\"","new":"import {and,eq,gte,inArray,lt} from \"drizzle-orm\""},
 {"file":"src/app/dashboard/queue/page.tsx","old":"const now=new Date(),tomorrow=new Date(now.getTime()+86400000);","new":"const now=new Date(Date.now()-12*3600000),tomorrow=new Date(Date.now()+86400000);"},
 {"file":"src/app/dashboard/queue/page.tsx","old":"gte(bookings.startAt,now),lt(bookings.startAt,tomorrow)));const serviceRows=await db.select({bookingId:bookingServices.bookingId,name:bookingServices.serviceName}).from(bookingServices);","new":"gte(bookings.startAt,now),lt(bookings.startAt,tomorrow),inArray(bookings.status,[\"confirmed\",\"in_progress\",\"done\",\"no_show\"])));const serviceRows=items.length?await db.select({bookingId:bookingServices.bookingId,name:bookingServices.serviceName}).from(bookingServices).where(inArray(bookingServices.bookingId,items.map(x=>x.id))):[];"}
];
const OTP_ROUTE="import { NextRequest,NextResponse } from \"next/server\";import { sendOtp,verifyOtp,signVerification } from \"@/server/otp\";\nexport async function POST(r:NextRequest){try{const b=await r.json();if(b.code){const customer=await verifyOtp(b.phone,b.code);return NextResponse.json({verificationToken:signVerification(customer.id)})}return NextResponse.json(await sendOtp(b.phone))}catch{return NextResponse.json({error:\"invalid_otp\"},{status:400})}}\n",OTP_ADD="\nimport { createHmac,timingSafeEqual } from \"crypto\";\nconst secret=()=>{const s=process.env.AUTH_SECRET;if(!s)throw new Error(\"AUTH_SECRET is required\");return s};\nexport function signVerification(customerId:string,ttlMs=15*60_000){const body=`${customerId}.${Date.now()+ttlMs}`;return `${body}.${createHmac(\"sha256\",secret()).update(body).digest(\"hex\")}`}\nexport function readVerification(token:string):string|null{const [id,exp,sig]=String(token).split(\".\");if(!id||!exp||!sig||Number(exp)<Date.now())return null;const want=createHmac(\"sha256\",secret()).update(`${id}.${exp}`).digest();const got=Buffer.from(sig,\"hex\");return got.length===want.length&&timingSafeEqual(got,want)?id:null}\n";
let failed=0;
for(const {file,old,new:neu} of REPLACEMENTS){
  if(!fs.existsSync(file)){console.log("MISSING  "+file);failed++;continue}
  const s=fs.readFileSync(file,"utf8");
  if(s.includes(neu)){console.log("already  "+file);continue}
  const n=s.split(old).length-1;
  if(n!==1){console.log("NO MATCH ("+n+")  "+file+"  <- "+old.slice(0,60));failed++;continue}
  fs.writeFileSync(file,s.replace(old,()=>neu));console.log("fixed    "+file);
}
const routeFile="src/app/api/booking/otp/route.ts";
fs.mkdirSync(path.dirname(routeFile),{recursive:true});fs.writeFileSync(routeFile,OTP_ROUTE);console.log("wrote    "+routeFile);
const otpFile="src/server/otp.ts";const otp=fs.readFileSync(otpFile,"utf8");
if(otp.includes("signVerification"))console.log("already  "+otpFile);else{fs.writeFileSync(otpFile,otp+OTP_ADD);console.log("fixed    "+otpFile)}
const nested="QueueCut-Smart-Appointment-System";
if(fs.existsSync(nested)){fs.rmSync(nested,{recursive:true,force:true});console.log("deleted  nested folder "+nested)}
if(failed){console.log("\n"+failed+" step(s) failed - send me this output.");process.exit(1)}
console.log("\nAll fixes applied. Now add AUTH_SECRET to .env.test, then run typecheck and tests.");

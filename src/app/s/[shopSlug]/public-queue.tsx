"use client";
import { useEffect, useState } from "react";
type Summary={nowServing:string[];remainingSlots:number;nextFree:string[]};
export default function PublicQueue({shopId,timeZone}:{shopId:string;timeZone:string}){
 const [data,setData]=useState<Summary>();
 useEffect(()=>{const load=()=>fetch(`/api/shops/${shopId}/public-queue`).then(r=>r.json()).then(setData).catch(()=>undefined);load();const events=new EventSource(`/api/shops/${shopId}/events`);events.addEventListener("queue-changed",load);const timer=setInterval(load,30000);return()=>{events.close();clearInterval(timer)}},[shopId]);
 const next=data?.nextFree[0];const clock=(iso:string)=>new Intl.DateTimeFormat("en-US",{timeZone,hour:"numeric",minute:"2-digit"}).format(new Date(iso));
 return <section className="card live-card" aria-live="polite"><div className="live-icon" aria-hidden="true">▰</div><h2>Live in the shop</h2><p className="live-copy">Check our latest updates and styles.</p><dl className="summary-rows"><div><dt>Now serving</dt><dd>{data?(data.nowServing.length?data.nowServing.join(", "):"Nobody yet"):"Loading"}</dd></div><div><dt>Next free time today</dt><dd>{data?(next?clock(next):"Fully booked"):"Loading"}</dd></div></dl><img className="shop-photo" src="/images/barber-chair.png" alt="A barber chair in the shop"/></section>;
}

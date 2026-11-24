"use client";

import { useState } from "react";

type Booking={ticketNumber:string;ticketToken:string;startAt:string;status:string;services:string[]};

export default function MyBookings({shopSlug,timeZone}:{shopSlug:string;timeZone:string}){
  const [phone,setPhone]=useState("");
  const [bookings,setBookings]=useState<Booking[]|null>(null);
  const [loading,setLoading]=useState(false);
  async function findBookings(){
    setLoading(true);setBookings(null);
    try{const response=await fetch(`/api/booking/mine?shop=${encodeURIComponent(shopSlug)}&phone=${encodeURIComponent(phone.trim())}`);setBookings(response.ok?await response.json():[])}finally{setLoading(false)}
  }
  return <section className="customer-info-card">
    <h2>Your appointments</h2>
    <p>Enter the phone number used when booking to see your appointments.</p>
    <div className="side-form"><label>Phone number<input type="tel" value={phone} onChange={event=>setPhone(event.target.value)} placeholder="+923001234567" autoComplete="tel"/></label><button className="button" type="button" disabled={loading||phone.trim().length<8} onClick={findBookings}>{loading?"Finding…":"Find my bookings"}</button></div>
    {bookings?.length===0&&<p className="hint">No appointments were found for that phone number.</p>}
    {bookings?.map(booking=><article className="customer-info-card" key={booking.ticketToken}><p className="customer-eyebrow">{booking.status.replace("_"," ")}</p><h3>{booking.services.join(", ")||"Appointment"}</h3><p>{new Intl.DateTimeFormat("en-PK",{dateStyle:"medium",timeStyle:"short",timeZone}).format(new Date(booking.startAt))}</p><a className="button" href={`/t/${booking.ticketToken}`}>Open ticket {booking.ticketNumber}</a></article>)}
  </section>;
}

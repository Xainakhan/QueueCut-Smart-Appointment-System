"use client";

import { useEffect, useState } from "react";
import { AppShell } from "../../ui";

type TicketBooking = {
  id: string; token: string; ticketNumber: string; status: string; startAt: string;
  offeredStartAt: string | null; services: string[]; shopId: string;
};

export default function Ticket({ booking }: { booking: TicketBooking }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const appointmentTime = new Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short" }).format(new Date(booking.startAt));

  useEffect(() => {
    const events = new EventSource(`/api/shops/${booking.shopId}/events`);
    events.addEventListener("queue-changed", () => location.reload());
    return () => events.close();
  }, [booking.shopId]);

  async function acceptEarlierTime() {
    setPending(true);
    const response = await fetch(`/api/tickets/${booking.id}/accept`, { method: "POST" });
    setPending(false);
    if (response.ok) location.reload();
    else setMessage("Unable to accept the earlier time. Please try again.");
  }

  return <AppShell title="Your ticket"><main id="main" className="ticket-page">
    <section className="ticket-hero">
      <p className="ticket-kicker">YOUR APPOINTMENT</p>
      <h1>Your ticket</h1>
      <p>Keep this page open for live updates from the shop.</p>
      <div className="ticket-code" aria-label={`Ticket number ${booking.ticketNumber}`}>{booking.ticketNumber}</div>
      <span className={`status ${booking.status}`}>{booking.status.replace("_", " ")}</span>
    </section>

    <section className="ticket-details">
      <div className="ticket-details__heading"><div><p className="ticket-kicker">BOOKING DETAILS</p><h2>You&apos;re all set</h2></div><span className="ticket-check" aria-hidden="true">✓</span></div>
      <dl><div><dt>Service</dt><dd>{booking.services.join(", ") || "Appointment"}</dd></div><div><dt>Expected start</dt><dd>{appointmentTime}</dd></div></dl>
      {booking.offeredStartAt ? <div className="ticket-offer"><p>An earlier time is available at <strong>{new Date(booking.offeredStartAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</strong>.</p><button disabled={pending} onClick={acceptEarlierTime}>Accept earlier time</button></div> : null}
      <button className="ghost ticket-alert-button" aria-label="Enable appointment alerts" onClick={() => setMessage("Browser alerts are not available yet.")}>Enable alerts</button>
    </section>
    {message ? <p className="ticket-message" aria-live="polite">{message}</p> : null}
  </main></AppShell>;
}

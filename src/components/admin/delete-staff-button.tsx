"use client";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
export function DeleteStaffButton({ name, action }: { name: string; action: () => Promise<void> }) { const [error, setError] = useState(""); const [pending, setPending] = useState(false); const remove = async () => { if (!confirm(`Delete ${name}? This cannot be undone.`)) return; setPending(true); setError(""); try { await action(); } catch { setError("This team member could not be deleted. They may have existing bookings."); setPending(false); } }; return <><button type="button" className="icon-danger" aria-label={`Delete ${name}`} onClick={remove} disabled={pending}><FiTrash2 /></button>{error ? <span className="row-error" role="alert">{error}</span> : null}</>; }

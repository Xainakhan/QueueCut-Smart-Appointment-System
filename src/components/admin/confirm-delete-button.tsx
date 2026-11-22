"use client";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

export function ConfirmDeleteButton({ itemName, itemType, action }: { itemName: string; itemType: string; action: () => Promise<void> }) {
  const [open, setOpen] = useState(false); const [pending, setPending] = useState(false); const [error, setError] = useState("");
  const remove = async () => { setPending(true); setError(""); try { await action(); setOpen(false); } catch { setError(`This ${itemType.toLowerCase()} cannot be deleted because it may be used by an existing booking.`); setPending(false); } };
  return <><button type="button" className="icon-danger" aria-label={`Delete ${itemName}`} onClick={() => setOpen(true)}><FiTrash2 /></button>{open ? <div className="confirm-backdrop" role="presentation"><section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title"><h2 id="delete-title">Delete {itemType}?</h2><p>Delete <b>{itemName}</b>? This cannot be undone.</p>{error ? <p className="form-error" role="alert">{error}</p> : null}<div className="action-row"><button type="button" className="ghost" onClick={() => setOpen(false)} disabled={pending}>Cancel</button><button type="button" className="danger-button" onClick={remove} disabled={pending}>{pending ? "Deleting…" : "Delete"}</button></div></section></div> : null}</>;
}

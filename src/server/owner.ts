import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import { services, shops, staff } from "@/db/schema";
import { isValidTimeZone } from "@/lib/time-zones";
import { isAllowedShopSlug } from "@/lib/shop-slugs";
const serviceInput = z.object({ name:z.string().min(2).max(80), durationMinutes:z.coerce.number().int().min(5).max(480), price:z.coerce.number().min(0) });
export async function requireOwner() { const session=await auth(); if (!session?.user || session.user.role!=="owner") throw new Error("Owner access required"); return session.user; }
export async function addService(input: unknown) { const owner=await requireOwner(); const data=serviceInput.parse(input); await db.insert(services).values({ ...data, price: String(data.price), shopId:owner.shopId }); }
export async function deleteService(id: string) { const owner = await requireOwner(); await db.delete(services).where(and(eq(services.id, id), eq(services.shopId, owner.shopId))); }
export async function toggleService(id:string, active:boolean) { const owner=await requireOwner(); await db.update(services).set({active}).where(and(eq(services.id,id),eq(services.shopId,owner.shopId))); }
export async function updateShop(input: unknown) { const owner=await requireOwner(); const data=z.object({name:z.string().min(2),slug:z.string().trim().toLowerCase().refine(isAllowedShopSlug,"Use a lowercase slug; reserved paths are not allowed"),timeZone:z.string().refine(isValidTimeZone,"Choose a valid IANA time zone"),bufferMinutes:z.coerce.number().int().min(0).max(60)}).parse(input); await db.update(shops).set(data).where(eq(shops.id,owner.shopId)); }
export async function addStaff(input: unknown) { const owner=await requireOwner(); const data=z.object({name:z.string().trim().min(2),workingHours:z.string().min(9),breakStart:z.string().regex(/^\d{2}:\d{2}$/),breakEnd:z.string().regex(/^\d{2}:\d{2}$/)}).parse(input); const duplicate=await db.query.staff.findFirst({where:and(eq(staff.shopId,owner.shopId),sql`lower(${staff.name}) = lower(${data.name})`)}); if(duplicate)throw new Error("A team member with this name already exists"); await db.insert(staff).values({shopId:owner.shopId,name:data.name,workingHours:{mon:data.workingHours,tue:data.workingHours,wed:data.workingHours,thu:data.workingHours,fri:data.workingHours,sat:data.workingHours},breaks:[{start:data.breakStart,end:data.breakEnd}]}); }
export async function deleteStaff(id: string) { const owner = await requireOwner(); await db.delete(staff).where(and(eq(staff.id, id), eq(staff.shopId, owner.shopId))); }

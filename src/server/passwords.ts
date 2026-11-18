import { randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
const scrypt = promisify(nodeScrypt);
export async function hashPassword(password: string) { const salt = randomBytes(16).toString("hex"); const hash = (await scrypt(password, salt, 64)) as Buffer; return `${salt}:${hash.toString("hex")}`; }
export async function verifyPassword(password: string, stored: string) { const [salt, saved] = stored.split(":"); if (!salt || !saved) return false; const hash = (await scrypt(password, salt, 64)) as Buffer; return timingSafeEqual(hash, Buffer.from(saved, "hex")); }

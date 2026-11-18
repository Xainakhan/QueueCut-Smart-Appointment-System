import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./passwords";
describe("password hashing", () => { it("verifies only the original password", async () => { const hash = await hashPassword("test-password"); await expect(verifyPassword("test-password", hash)).resolves.toBe(true); await expect(verifyPassword("nope", hash)).resolves.toBe(false); }); });

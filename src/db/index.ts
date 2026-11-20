import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import {loadTestEnv}from"@/lib/load-test-env";

if(process.env.NODE_ENV==="test"||!process.env.DATABASE_URL||process.env.DATABASE_URL.includes("HOST"))loadTestEnv();
const configuredUrl=process.env.NODE_ENV === "test" ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL;
const connectionString = !configuredUrl||configuredUrl.includes("HOST") ? process.env.DATABASE_URL_TEST : configuredUrl;
if (!connectionString && process.env.NODE_ENV === "production") throw new Error("DATABASE_URL is required");
/** The one process-wide pool is shared by the app and integration tests. */
export const dbPool = new Pool({ connectionString: connectionString ?? "postgresql://invalid", max: process.env.NODE_ENV === "test" ? 5 : undefined });
export const db = drizzle({ client: dbPool, schema });

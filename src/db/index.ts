import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import {loadTestEnv}from"@/lib/load-test-env";

if(process.env.NODE_ENV==="test"||!process.env.DATABASE_URL||process.env.DATABASE_URL.includes("HOST"))loadTestEnv();
const configuredUrl=process.env.NODE_ENV === "test" ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL;
const connectionString = !configuredUrl||configuredUrl.includes("HOST") ? process.env.DATABASE_URL_TEST : configuredUrl;
if (!connectionString && process.env.NODE_ENV === "production") throw new Error("DATABASE_URL is required");
const pool = new Pool({ connectionString: connectionString ?? "postgresql://invalid" });
export const db = drizzle({ client: pool, schema });

import { defineConfig } from "drizzle-kit";
import {loadTestEnv,loadLocalEnv}from"./src/lib/load-test-env";loadLocalEnv();
if(process.env.NODE_ENV==="test")loadTestEnv();
const url=process.env.NODE_ENV==="test"?process.env.DATABASE_URL_TEST:process.env.DATABASE_URL_UNPOOLED??process.env.DATABASE_URL;
export default defineConfig({ schema: "./src/db/schema.ts", out: "./drizzle", dialect: "postgresql", dbCredentials: { url: url ?? "" } });



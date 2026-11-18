import { defineConfig, globalIgnores } from "eslint/config";
export default defineConfig([globalIgnores([".next/**", "dist/**", "drizzle/**", "node_modules/**"])]);

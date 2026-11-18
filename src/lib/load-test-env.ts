import {existsSync,readFileSync}from"node:fs";import {resolve}from"node:path";
/** Loads only local test credentials; process environment still takes precedence. */
export function loadTestEnv(){const file=resolve(process.cwd(),".env.test");if(!existsSync(file))return;for(const line of readFileSync(file,"utf8").split(/\r?\n/)){const match=line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);if(!match||process.env[match[1]])continue;const value=match[2].replace(/^(["'])(.*)\1$/,"$2");process.env[match[1]]=value}}

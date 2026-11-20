import {fileURLToPath}from"node:url";import {defineConfig}from"vitest/config";
export default defineConfig({resolve:{alias:{"@":fileURLToPath(new URL("./src",import.meta.url))}},test:{fileParallelism:false,maxWorkers:1,minWorkers:1,testTimeout:60000,hookTimeout:60000}});

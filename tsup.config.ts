import { defineConfig } from "tsup";

export default defineConfig({
    // All of our entry-points
    entry: [
        "src/index.ts",
        "src/cli/index.ts",
    ],
    external: ["viem", "@ubiquity-dao/rpc-handler"],
    // Format waited
    format: ["cjs", "esm"],
    // Code splitting and stuff
    clean: true,
    splitting: true,
    minify: true,
    // Types config
    dts: {
        resolve: true,
    },
});

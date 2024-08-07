import { defineConfig } from "tsup";

export default defineConfig({
    // All of our entry-points
    entry: [
        "src/index.ts"
    ],
    external: [
        // todo: Viem as peer dependency? For standard chain + network support?
        // "viem",
    ],
    // Format waited
    format: ["cjs", "esm"],
    // Code splitting and stuff
    clean: true,
    splitting: true,
    // Types config
    dts: {
        resolve: true,
    },
});

import { build } from "esbuild";
import { print } from "gluegun";

/**
 * Write the `erpc.yaml` output file
 * @param config
 * @param outputPath
 */
export async function writeErpcConfig({
    configFile,
    outputPath = "erpc.js",
}: { configFile: string; outputPath?: string }) {
    const spinner = print.spin({ text: "Writing bundled eRPC config file" });
    // First initial esbuild
    spinner.start();
    spinner.text = "Pre bundle using esbuild";
    const result = await build({
        entryPoints: [configFile],
        outfile: outputPath,
        // Terser will handle minification
        bundle: true,
        minify: true,
        splitting: false,
        // Drop any console or debugger related code
        sourcemap: "inline",
        // erpc-cloud/config is included inside the src docker image
        external: ["@erpc-cloud/config"],
    });
    if (result.errors.length > 0) {
        spinner.fail("Failed to write eRPC config file");
        spinner.stop();

        print.newline();
        print.error("Errors:");
        for (const error of result.errors) {
            print.error(` - ${error}`);
        }
        return;
    }
    spinner.succeed("Bundled eRPC config file written successfully");
}

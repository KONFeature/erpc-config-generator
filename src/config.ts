import { stringify } from "yaml";
import type { Config } from "./generatedTypes/erpcTypes";

/// Header for the generate file
const header =
    "# Config generated using: https://github.com/KONFeature/erpc-config-generator";

/**
 * Write the `erpc.yaml` output file
 * @param config
 * @param outputPath
 */
export function writeErpcConfig({
    config,
    outputPath = "erpc.yaml",
}: { config: Config; outputPath?: string }) {
    // Stringify the config object
    const yamlStr = stringify(config, {
        lineWidth: -1, // Disable line wrapping
        anchorPrefix: "var",
    });

    // Add a top level header mentioning it's auto generated
    const finalString = `${header}\n${yamlStr}`;

    // Write it to the file
    Bun.write(outputPath, finalString);
    console.log(`Config file written to ${outputPath}`);
}

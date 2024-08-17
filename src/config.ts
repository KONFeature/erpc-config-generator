import { stringify } from "yaml";
import type { Config } from "./generatedTypes/erpcTypes";

/**
 * Create an erpc config
 * @param config
 * @param outputPath
 */
export function writeErpcConfig(config: Config, outputPath = "erpc.yaml") {
    // Stringify the config object
    const yamlStr = stringify(config, {
        lineWidth: -1, // Disable line wrapping
        anchorPrefix: "var",
    });

    // Add a top level header mentioning it's auto generated
    const finalString = `# Config generated using: https://github.com/KONFeature/erpc-config-generator \n${yamlStr}`;

    // Write it to the file
    Bun.write(outputPath, finalString);
    console.log(`Config file written to ${outputPath}`);
}

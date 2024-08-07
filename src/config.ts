import { stringify } from "yaml";
import type { Config } from "./generatedTypes/erpcTypes";

/**
 * Create an erpc config
 * @param config
 * @param outputPath
 */
export function createErpcConfig(config: Config, outputPath = "erpc.yaml") {
    // todo: Should use a mapping of types key to yaml key from initial go types

    const yamlStr = stringify(config, {
        lineWidth: -1, // Disable line wrapping
    });

    Bun.write(outputPath, yamlStr);
    console.log(`Config file written to ${outputPath}`);
}

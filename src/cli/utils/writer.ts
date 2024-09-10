import { writeFileSync } from "node:fs";
import { stringify } from "yaml";
import type { Config } from "../../generatedTypes/erpcTypes";

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
    // Strip down the config to only keep the field we want
    config = {
        logLevel: config.logLevel,
        server: config.server,
        metrics: config.metrics,
        admin: config.admin,
        database: config.database,
        projects: config.projects,
        rateLimiters: config.rateLimiters,
    };

    // Stringify the config object
    const yamlStr = stringify(config, {
        lineWidth: -1, // Disable line wrapping
        anchorPrefix: "var",
    });

    // Add a top level header mentioning it's auto generated
    const finalString = `${header}\n${yamlStr}`;

    // Write it to the file
    writeFileSync(outputPath, finalString);
}

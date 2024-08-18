import { existsSync } from "node:fs";
import path from "node:path";
import { bundleRequire } from "bundle-require";
import type { GluegunToolbox } from "gluegun";
import type { Config } from "../../generatedTypes/erpcTypes";
import { writeErpcConfig } from "../utils/config";

/**
 * The command to generate the eRPC config
 */
export async function generate({ print, parameters }: GluegunToolbox) {
    const spinner = print.spin({ text: "Generating eRPC config file" });
    spinner.start();
    print.newline();

    // Extract the arguments
    const configFile = parameters.options.config ?? "./erpc-config.ts";
    const outputFile = parameters.options.out ?? "./erpc.yaml";

    if (typeof configFile !== "string") {
        throw new Error("Invalid config file");
    }
    if (typeof outputFile !== "string") {
        throw new Error("Invalid output file");
    }

    // Log a few stuff
    print.info("Parmaeters:");
    print.info(` - Configuration file: ${configFile}`);
    print.info(` - Output file: ${outputFile}`);

    // Load the user config
    spinner.text = "Loading typescript eRPC config";
    const config = await loadConfigFromFile(configFile);

    // Log a few info
    print.info("Config:");
    print.info(` - Projects: ${config.projects.length}`);
    print.info(
        ` - Rate limiters: ${config.rateLimiters?.budgets?.length ?? 0}`
    );

    // Write the erpc config
    spinner.text = "Writing eRPC config file";
    writeErpcConfig({ config, outputPath: outputFile });
    spinner.succeed("eRPC config file written!");
}

/**
 * Load the config file
 * @param configFile
 * @returns
 */
async function loadConfigFromFile(configFile: string): Promise<Config> {
    // Ensure the config file is a typescript one exist
    if (!configFile.endsWith(".ts")) {
        throw new Error("Config file must be a typescript file");
    }

    const absoluteConfigPath = path.resolve(process.cwd(), configFile);

    // Ensure the config file exist
    {
        const fileExist = existsSync(absoluteConfigPath);
        if (!fileExist) {
            throw new Error(`Config file not found: ${configFile}`);
        }
    }

    // Find the exported config stuff
    const userConfig = await bundleRequire({ filepath: absoluteConfigPath });

    // Check if there's a default export
    const config = userConfig.mod.default;
    if (!config) {
        throw new Error(
            `No default export found in config file at: ${configFile}`
        );
    }

    // Perform a few basics type checks
    if (typeof config !== "object") {
        throw new Error("Config must be an object");
    }

    // Ensure the config has the required fields
    if (
        !config.projects ||
        !config.logLevel ||
        !Array.isArray(config.projects)
    ) {
        throw new Error("Config must have a `projects` and `logLevel` field");
    }

    return config as Config;
}

import path from "node:path";
import type { GluegunToolbox } from "gluegun";
import type { Config } from "../../generatedTypes/erpcTypes";
import { writeErpcConfig } from "../utils/config";

export default {
    name: "erpc-config",
    description: "Generate the eRPC config for the current project",
    alias: ["config"],
    options: [
        {
            name: "config",
            description: "The path to the config file",
            type: "string",
        },
        {
            name: "out",
            description: "The output file path",
            type: "string",
        },
    ],
    run: async ({ print, parameters }: GluegunToolbox) => {
        // Header
        print.info("==============================");
        print.info("==   eRPC Config Generator  ==");
        print.info("==============================");

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
        print.info(" - Parmaeters:");
        print.info(`   - Configuration file: ${configFile}`);
        print.info(`   - Output file: ${outputFile}`);

        // Load the user config
        const config = await loadConfigFromFile(configFile);

        // Start the file writing
        print.info("Generating the eRPC config file...");

        // Write the erpc config
        writeErpcConfig({ config, outputPath: outputFile });

        print.success("eRPC config file generated!");
    },
};

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
        const fileExist = await Bun.file(absoluteConfigPath).exists();
        if (!fileExist) {
            throw new Error(`Config file not found: ${configFile}`);
        }
    }

    // Find the exported config stuff
    const userConfig = await import(absoluteConfigPath);

    // Check if there's a default export
    const config = userConfig.default;
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

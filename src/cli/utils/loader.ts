import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { bundleRequire } from "bundle-require";
import type { Config } from "../../generatedTypes/erpcTypes";

/**
 * Load the config file
 * @param configFile
 * @returns
 */
export async function loadConfigFromFile(configFile: string): Promise<Config> {
    // Ensure the config file is a typescript one exist
    if (!configFile.endsWith(".ts")) {
        throw new Error("Config file must be a typescript file");
    }

    const absoluteConfigPath = resolve(process.cwd(), configFile);

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

    // Return the config object as it is
    //  check are performed just after with the `checkConfigValidity` function
    return config as Config;
}

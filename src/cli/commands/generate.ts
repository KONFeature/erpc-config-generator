import type { GluegunToolbox } from "gluegun";
import { checkConfigValidity } from "../utils/assertion";
import { loadConfigFromFile } from "../utils/loader";
import { printConfigError } from "../utils/printer";
import { writeErpcConfig } from "../utils/writer";

/**
 * The command to generate the eRPC config
 */
export async function generateCmd({ print, parameters }: GluegunToolbox) {
    const spinner = print.spin({ text: "Generating eRPC config file" });
    spinner.start();

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
    print.newline();
    print.info("Parameters:");
    print.info(` - Configuration file: ${configFile}`);
    print.info(` - Output file: ${outputFile}`);

    // Load the user config
    spinner.text = "Loading typescript eRPC config";
    const config = await loadConfigFromFile(configFile);

    // Assert the config validity
    const { errors, hasFatalError, stats } = checkConfigValidity(config);

    // Print the errors if any
    printConfigError(errors);

    // Stop the process if we have a fatal error
    if (hasFatalError) {
        spinner.fail("Fatal error in the config file");
        return;
    }

    // Log a few info
    print.newline();
    print.info("Config:");
    print.info(` - Projects: ${stats.projects}`);
    print.info(` - Rate limiters: ${stats.rateLimiters}`);

    // Write the erpc config
    spinner.text = "Writing eRPC config file";
    writeErpcConfig({ config, outputPath: outputFile });
    spinner.succeed("eRPC config file written!");
}

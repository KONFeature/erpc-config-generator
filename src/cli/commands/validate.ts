import type { GluegunToolbox } from "gluegun";
import { checkConfigValidity } from "../utils/assertion";
import { loadConfigFromFile } from "../utils/loader";
import { printConfigError } from "../utils/printer";

/**
 * The command to generate the eRPC config
 */
export async function validateCmd({ print, parameters }: GluegunToolbox) {
    const spinner = print.spin({ text: "Validating eRPC config file" });
    spinner.start();

    // Extract the arguments
    const configFile = parameters.options.config ?? "./erpc-config.ts";

    if (typeof configFile !== "string") {
        throw new Error("Invalid config file");
    }

    // Log a few stuff
    print.newline();
    print.info("Parameters:");
    print.info(` - Configuration file: ${configFile}`);

    // Load the user config
    spinner.text = "Loading typescript eRPC config";
    const config = await loadConfigFromFile(configFile);

    // Assert the config validity
    const { errors, hasFatalError } = checkConfigValidity(config);

    // Print the errors if any
    printConfigError(errors);

    // Stop the process if we have a fatal error
    if (hasFatalError) {
        spinner.fail("Fatal error in the config file");
        return;
    }

    // Print the success message
    spinner.succeed("eRPC config file is valid!");
}

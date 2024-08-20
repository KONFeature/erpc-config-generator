import { build } from "gluegun";
import { generateCmd } from "./commands/generate";
import { validateCmd } from "./commands/validate";

/**
 * Create the cli and kick it off
 */
const cli = build()
    .brand("erpc-config")
    .src(__dirname)
    .help() // provides default for help, h, --help, -h
    .version() // provides default for version, v, --version, -v
    .command({
        name: "erpc-config",
        description:
            "Generate an eRPC yaml config file from the typescript config",
        alias: ["generate"],
        run: generateCmd,
    })
    .command({
        name: "validate",
        description: "Check the validity of the eRPC config file",
        alias: ["check"],
        run: validateCmd,
    })
    .create();

/**
 * Execute the command line
 * @param argv The arguments
 */
cli.run(process.argv);

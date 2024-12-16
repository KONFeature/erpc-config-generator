import { build } from "gluegun";
import { packageCmd } from "./commands/package";
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
        description: "Package the eRPC config file into a single js file",
        alias: ["generate"],
        run: packageCmd,
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

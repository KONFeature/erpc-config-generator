import { build } from "gluegun";
import { generate } from "./commands/generate";

/**
 * Create the cli and kick it off
 */
const cli = build()
    .brand("erpc-config")
    //.src(__dirname)
    .src("/Users/quentin/Workspace/Perso/erpc-config")
    .help() // provides default for help, h, --help, -h
    .version() // provides default for version, v, --version, -v
    .command({
        name: "erpc-config",
        description: "Generate the eRPC config for the current project",
        alias: ["generate"],
        run: generate,
    })
    .create();

/**
 * Execute the command line
 * @param argv The arguments
 */
cli.run(process.argv);

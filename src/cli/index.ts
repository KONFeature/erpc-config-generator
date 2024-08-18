import { build } from "gluegun";

/**
 * Create the cli and kick it off
 */
const cli = build()
    .brand("erpc-config")
    .src(__dirname)
    .plugins("./node_modules", { matching: "erpc-config-*", hidden: true })
    .plugins("./node_modules", {
        matching: "@konfeature/erpc-config-generator",
        hidden: true,
    })
    .plugins("./node_modules", { matching: "yaml", hidden: true })
    .help() // provides default for help, h, --help, -h
    .version() // provides default for version, v, --version, -v
    .create();

/**
 * Execute the command line
 * @param argv The arguments
 */
cli.run(process.argv);

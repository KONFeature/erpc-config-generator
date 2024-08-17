import { readdir, rm } from "node:fs/promises";

/**
 * Method used to generate fresh erpc types from the main branch of the erpc repo
 */
async function generateErpcTypes() {
    console.log("Building fresh erpc types...");

    // Check if a file or folder exist
    // from: https://stackoverflow.com/a/77992699
    const fExist = (path: string) =>
        !!Array.from(new Bun.Glob(path).scanSync({ onlyFiles: false }))[0];

    // Check if the tmp folder already exist, if yes remove it
    if (await fExist("./tmp")) {
        console.log(" - Removing existing tmp folder");
        await rm("./tmp", { recursive: true, force: true });
    }

    // Clone the erpc repo in a ./tmp folder (https://github.com/erpc/erpc.git)
    console.log(" - Cloning erpc repo");
    const cloneProcess = Bun.spawn([
        "git",
        "clone",
        "https://github.com/erpc/erpc.git",
        "./tmp",
    ]);
    await cloneProcess.exited;
    if (cloneProcess.exitCode !== 0) {
        console.error("Failed to clone the erpc repo");
        return;
    }

    // Copy the tygo.yaml file from the erpc repo to the current folder
    console.log(" - Copying tygo.yaml file");
    const tygoConfigFile = Bun.file("./cli/tygo.yaml");
    await Bun.write("./tmp/tygo.yaml", tygoConfigFile);

    // Run the tygo command to generate the types
    console.log(" - Running tygo command");
    const tygoProcess = Bun.spawn(["tygo", "generate"], {
        cwd: "./tmp",
    });
    await tygoProcess.exited;
    if (tygoProcess.exitCode !== 0) {
        console.error("Failed to generate erpc types");
        return;
    }

    // Copy the generated types to the generatedTypes folder
    console.log(" - Copying generated types");
    const generatedTypes = Bun.file("./tmp/dist/erpcTypes.ts");
    await Bun.write("./src/generatedTypes/erpcTypes.ts", generatedTypes);

    // Remove the tmp folder
    console.log(" - Removing tmp folder");
    await rm("./tmp", { recursive: true, force: true });

    console.log("Erpc types updated!");
}

await generateErpcTypes();

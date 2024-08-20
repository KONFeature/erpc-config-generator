import { print } from "gluegun";
import type { ConfigError } from "./assertion";

/**
 * Print the config errors
 */
export function printConfigError(errors: ConfigError[]) {
    if (errors.length === 0) {
        return;
    }

    // Group errors by projects
    const projects = new Map<string | undefined, ConfigError[]>();
    for (const error of errors) {
        if (!projects.has(error.projects)) {
            projects.set(error.projects, []);
        }
        projects.get(error.projects)?.push(error);
    }

    print.newline();
    print.error("Config errors:");

    // Print the errors grouped by project
    for (const [project, errors] of projects) {
        print.error(project ? ` - Project: ${project}:` : " - Global:");
        for (const error of errors) {
            if (error.level === "warning") {
                print.warning(`  - ${error.field}: ${error.message}`);
                continue;
            }

            print.error(`  - ${error.field}: ${error.message}`);
        }
    }
}

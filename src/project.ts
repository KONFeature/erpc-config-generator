import type { ProjectConfig } from "./generatedTypes/erpcTypes";
import type { OptionalRateLimit } from "./types/utils";

/**
 * Build a project config
 */
export function buildProject(
    projectConfig: OptionalRateLimit<ProjectConfig>
): ProjectConfig {
    return {
        rateLimitBudget: projectConfig.rateLimitBudget ?? "",
        ...projectConfig,
    };
}

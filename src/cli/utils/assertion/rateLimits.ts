import type { Config } from "@erpc-cloud/config";
import type { ConfigError } from ".";

/**
 * Check that the config doesn't contain duplicated rate limits id
 */
export function checkRateLimitsDuplication(config: Config): {
    errors: ConfigError[];
    ids: Set<string>;
} {
    const errors: ConfigError[] = [];
    const rateLimiters = config.rateLimiters?.budgets ?? [];

    const ids = new Set<string>();
    for (const rateLimiter of rateLimiters) {
        if (!rateLimiter) continue;
        if (ids.has(rateLimiter.id)) {
            errors.push({
                field: `rateLimiters.budget.${rateLimiter}`,
                message: `Duplicated rate limit budget: ${rateLimiter.id}`,
                level: "error",
            });
            continue;
        }
        ids.add(rateLimiter.id);
    }

    return { errors, ids };
}

/**
 * Ensure that every rate limits referenced in the projects are defined
 */
export function checkRateLimitsReference({
    config,
    rateLimitsIds,
}: { config: Config; rateLimitsIds: Set<string> }): ConfigError[] {
    const errors: ConfigError[] = [];
    const unusedRateLimits = new Set(rateLimitsIds);
    const projects = config.projects;

    // Helper to check an array of rate limits
    function checkRateLimits({
        rateLimits,
        field,
    }: {
        rateLimits: (string | undefined)[];
        field: string;
    }) {
        for (const rateLimit of rateLimits) {
            // If not set, skip
            if (!rateLimit || rateLimit === "") {
                continue;
            }

            // Remove the rate limit from the unused set
            unusedRateLimits.delete(rateLimit);

            // If the rate limit is not defined, push an error
            if (!rateLimitsIds.has(rateLimit)) {
                errors.push({
                    field,
                    message: `Undefined rate limit budget: ${rateLimit}`,
                    level: "error",
                });
            }
        }
    }

    // Check every project
    for (const project of projects) {
        if (!project) continue;

        // Check the project rate limit
        checkRateLimits({
            rateLimits: [project.rateLimitBudget],
            field: `project.${project.id}.rateLimitBudget`,
        });

        // Check the auth strategies
        const authStrategiesRateLimits =
            project?.auth?.strategies?.map(
                (strategy) => strategy?.rateLimitBudget
            ) ?? [];
        checkRateLimits({
            rateLimits: authStrategiesRateLimits,
            field: `project.${project.id}.auth.strategies.rateLimitBudget`,
        });

        // Check the upstreams
        const upstreamsRateLimits = project?.upstreams.map(
            (upstream) => upstream?.rateLimitBudget
        );
        checkRateLimits({
            rateLimits: upstreamsRateLimits,
            field: `project.${project.id}.upstreams.rateLimitBudget`,
        });

        // Check the networks
        const networksRateLimits =
            project?.networks?.map((network) => network?.rateLimitBudget) ?? [];
        checkRateLimits({
            rateLimits: networksRateLimits,
            field: `project.${project.id}.networks.rateLimitBudget`,
        });
    }

    // If we got unused rate limits, push the errors
    for (const rateLimiter of unusedRateLimits) {
        errors.push({
            field: `rateLimiters.budget.${rateLimiter}`,
            message: `Unused rate limit budget : ${rateLimiter}`,
            level: "warning",
        });
    }

    return errors;
}

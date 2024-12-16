import type { Config } from "@erpc-cloud/config";
import {
    checkRateLimitsDuplication,
    checkRateLimitsReference,
} from "./rateLimits";

type ConfigCheckResult = {
    errors: ConfigError[];
    hasFatalError: boolean;
    // Some global info
    stats: {
        projects: number;
        rateLimiters: number;
        server?: {
            port?: number;
            hostV4?: string;
            hostV6?: string;
        };
        metrics?: {
            port?: number;
            hostV4?: string;
            hostV6?: string;
        };
    };
};

export type ConfigError = {
    projects?: string;
    field: string;
    message: string;
    level?: "error" | "warning";
};

/**
 * Check the config validity
 */
export function checkConfigValidity(config: Config): ConfigCheckResult {
    // All the error we will face
    const errors: ConfigError[] = [];
    const stats: ConfigCheckResult["stats"] = {
        projects: 0,
        rateLimiters: 0,
        freeUpstreamDesired: 0,
    };

    // Perform a few basics type checks
    if (typeof config !== "object") {
        errors.push({
            field: "root",
            message: "Config must be an object",
            level: "error",
        });
        return { errors, hasFatalError: true, stats };
    }

    // Ensure the config has the required fields
    if (
        !config.projects ||
        !config.logLevel ||
        !Array.isArray(config.projects)
    ) {
        errors.push({
            field: "projects",
            message: "Config must have a `projects` field",
            level: "error",
        });
        errors.push({
            field: "logLevel",
            message: "Config must have a `logLevel` field",
            level: "error",
        });
        return { errors, hasFatalError: true, stats };
    }

    // Update our stats object
    stats.projects = config.projects.length;
    stats.rateLimiters = config.rateLimiters?.budgets?.length ?? 0;
    stats.server = config.server
        ? {
              port: config.server.httpPort,
              hostV4: config.server.listenV4
                  ? config.server.httpHostV4
                  : undefined,
              hostV6: config.server.listenV6
                  ? config.server.httpHostV6
                  : undefined,
          }
        : undefined;
    stats.metrics = config.metrics?.enabled
        ? {
              port: config.metrics.port,
              hostV4: config.metrics.listenV4
                  ? config.metrics.hostV4
                  : undefined,
              hostV6: config.metrics.listenV6
                  ? config.metrics.hostV6
                  : undefined,
          }
        : undefined;

    // Check for projects duplication
    errors.push(...checkProjectsDuplication(config));

    // Check rate limits id duplication
    const { errors: rateLimitsErrors, ids: rateLimitsIds } =
        checkRateLimitsDuplication(config);
    errors.push(...rateLimitsErrors);

    // Check for rate limits reference
    errors.push(...checkRateLimitsReference({ config, rateLimitsIds }));

    return {
        errors,
        hasFatalError: errors.some((error) => error.level === "error"),
        stats,
    };
}

/**
 * Check that the config doesn't contain duplicated rate limits id
 */
function checkProjectsDuplication(config: Config): ConfigError[] {
    const errors: ConfigError[] = [];
    const projects = config.projects;

    const ids = new Set<string>();
    for (const project of projects) {
        if (!project) continue;
        if (ids.has(project.id)) {
            errors.push({
                field: `project.${project.id}`,
                message: `Duplicated project id: ${project.id}`,
                level: "error",
            });
            continue;
        }
        ids.add(project.id);
    }

    return errors;
}

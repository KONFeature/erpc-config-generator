import type { UpstreamConfig } from "./generatedTypes/erpcTypes";

/**
 * Generic type to overide network config
 */
export type UpstreamOverride = Partial<
    Omit<UpstreamConfig, "id" | "endpoint" | "type" | "rateLimitBudget">
>;

/**
 * Build an envio upstream
 */
export function getEnvioUpstream({
    id = "envio",
    endpoint = "evm+envio://rpc.hypersync.xyz",
    rateLimitBudget = "",
    options = {},
}: {
    id?: string;
    endpoint?: string;
    rateLimitBudget?: string;
    options?: UpstreamOverride;
}): UpstreamConfig {
    return {
        // Base stuff
        id,
        endpoint,
        rateLimitBudget,
        type: "evm+envio",
        // Generic stuff
        vendorName: "Envio",
        ignoreMethods: [],
        allowMethods: ["*"],
        autoIgnoreUnsupportedMethods: true,
        // Overide options
        ...options,
    };
}

/**
 * Build an alchemy upstream
 */
export function getAlchemyUpstream({
    id = "alchemy",
    endpoint,
    rateLimitBudget = "",
    options = {},
}: {
    id?: string;
    endpoint: string;
    rateLimitBudget?: string;
    options?: UpstreamOverride;
}): UpstreamConfig {
    return {
        // Base stuff
        id,
        endpoint,
        rateLimitBudget,
        type: "evm+alchemy",
        // Generic stuff
        vendorName: "Alchemy",
        ignoreMethods: [],
        allowMethods: ["*"],
        autoIgnoreUnsupportedMethods: true,
        // Overide options
        ...options,
    };
}

/**
 * Build a pimlico upstream
 */
export function getPimlicoUpstream({
    id = "pimlico",
    endpoint = "pimlico://public",
    rateLimitBudget = "",
    options = {},
}: {
    id?: string;
    endpoint?: string;
    rateLimitBudget?: string;
    options?: UpstreamOverride;
}): UpstreamConfig {
    return {
        // Base stuff
        id,
        endpoint,
        rateLimitBudget,
        type: "evm+pimlico",
        // Generic stuff
        vendorName: "Pimlico",
        ignoreMethods: [],
        allowMethods: ["*"],
        autoIgnoreUnsupportedMethods: true,
        // Overide options
        ...options,
    };
}

/**
 * Get an evm upstream
 */
export function getEvmUpstream({
    id,
    endpoint,
    rateLimitBudget = "",
    options = {},
}: {
    id: string;
    endpoint: string;
    rateLimitBudget?: string;
    options?: UpstreamOverride;
}): UpstreamConfig {
    return {
        // Base stuff
        id,
        endpoint,
        rateLimitBudget,
        type: "evm",
        // Generic stuff
        vendorName: "Generic Evm",
        ignoreMethods: [],
        allowMethods: ["*"],
        autoIgnoreUnsupportedMethods: true,
        // Overide options
        ...options,
    };
}

import type {
    BundlerRpcSchema,
    PublicRpcSchema,
    RpcSchema,
    WalletRpcSchema,
} from "viem";
import type { UpstreamConfig } from "./generatedTypes/erpcTypes";
import type { RpcMethodWithRegex } from "./types/rpc";
import type { OptionalRateLimit } from "./types/utils";

/**
 * Generic type to overide network config
 */
export type UpstreamOverride<TRpc extends RpcSchema> = Partial<
    Omit<
        OptionalRateLimit<UpstreamConfig>,
        "id" | "endpoint" | "type" | "ignoreMethods" | "allowMethods"
    > & {
        ignoreMethods?: RpcMethodWithRegex<TRpc>[];
        allowMethods?: RpcMethodWithRegex<TRpc>[];
    }
>;

/**
 * Build an envio upstream
 */
export function buildEnvioUpstream({
    id = "envio",
    endpoint = "evm+envio://rpc.hypersync.xyz",
    ...options
}: {
    id?: string;
    endpoint?: string;
} & UpstreamOverride<PublicRpcSchema> = {}): UpstreamConfig {
    return {
        // Base stuff
        id,
        endpoint,
        rateLimitBudget: options.rateLimitBudget ?? "",
        type: "evm+envio",
        // Generic stuff
        vendorName: "Envio",
        ignoreMethods: [],
        allowMethods: [],
        autoIgnoreUnsupportedMethods: true,
        // Overide options
        ...options,
    };
}

/**
 * Build an alchemy upstream
 */
export function buildAlchemyUpstream({
    id = "alchemy",
    apiKey,
    ...options
}: {
    id?: string;
    apiKey: string;
} & UpstreamOverride<
    [...PublicRpcSchema, ...WalletRpcSchema]
>): UpstreamConfig {
    return {
        // Base stuff
        id,
        endpoint: `evm+alchemy://${apiKey}`,
        type: "evm+alchemy",
        rateLimitBudget: options.rateLimitBudget ?? "",
        // Generic stuff
        vendorName: "Alchemy",
        ignoreMethods: [],
        allowMethods: [],
        autoIgnoreUnsupportedMethods: true,
        // Overide options
        ...options,
    };
}

/**
 * Build a pimlico upstream
 * todo: Should include paymaster rpc schema when available
 */
export function buildPimlicoUpstream({
    id = "pimlico",
    apiKey = "public",
    ...options
}: {
    id?: string;
    apiKey?: string;
} & UpstreamOverride<BundlerRpcSchema>): UpstreamConfig {
    return {
        // Base stuff
        id,
        endpoint: `evm+pimlico://${apiKey}`,
        rateLimitBudget: options.rateLimitBudget ?? "",
        type: "evm+pimlico",
        // Generic stuff
        vendorName: "Pimlico",
        ignoreMethods: [],
        allowMethods: [],
        autoIgnoreUnsupportedMethods: true,
        // Overide options
        ...options,
    };
}

/**
 * Get an evm upstream
 */
export function buildEvmUpstream<TRpc extends RpcSchema = PublicRpcSchema>({
    id,
    endpoint,
    ...options
}: {
    id: string;
    endpoint: string;
    rpcSchema?: TRpc;
} & UpstreamOverride<TRpc>): UpstreamConfig {
    return {
        // Base stuff
        id,
        endpoint,
        rateLimitBudget: options.rateLimitBudget ?? "",
        type: "evm",
        // Generic stuff
        vendorName: "Generic Evm",
        ignoreMethods: [],
        allowMethods: [],
        autoIgnoreUnsupportedMethods: true,
        // Overide options
        ...options,
    };
}

import type { UpstreamConfig } from "@erpc-cloud/config";
import type { EIP1474Methods, PublicRpcSchema, RpcSchema } from "viem";
import type {
    EnvioRpcSchema,
    MatcherRpcMethodOrString,
    PimlicoRpcSchema,
} from "../types/builder";

/**
 * Generic type to overide upstream config
 */
export type UpstreamOverride<TRpc extends RpcSchema> = Partial<
    Omit<
        UpstreamConfig,
        "id" | "endpoint" | "type" | "ignoreMethods" | "allowMethods"
    > & {
        ignoreMethods?: MatcherRpcMethodOrString<TRpc>[];
        allowMethods?: MatcherRpcMethodOrString<TRpc>[];
    }
>;

/**
 * Build an envio upstream
 */
export function buildEnvioUpstream({
    id = "envio",
    endpoint = "envio://rpc.hypersync.xyz",
    ...options
}: {
    id?: string;
    endpoint?: string;
} & UpstreamOverride<EnvioRpcSchema> = {}) {
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
    } as const satisfies UpstreamConfig;
}

/**
 * Build an alchemy upstream
 * todo: Should also import the full alchemy schema
 */
export function buildAlchemyUpstream({
    id = "alchemy",
    apiKey,
    ...options
}: {
    id?: string;
    apiKey: string;
} & UpstreamOverride<EIP1474Methods>): UpstreamConfig {
    return {
        // Base stuff
        id,
        endpoint: `alchemy://${apiKey}`,
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
 * Build a DRPC upstream
 */
export function buildDrpcUpstream({
    id = "drpc",
    apiKey,
    ...options
}: {
    id?: string;
    apiKey: string;
} & UpstreamOverride<EIP1474Methods>): UpstreamConfig {
    return {
        // Base stuff
        id,
        endpoint: `drpc://${apiKey}`,
        type: "evm+drpc",
        rateLimitBudget: options.rateLimitBudget ?? "",
        // Generic stuff
        vendorName: "Drpc",
        ignoreMethods: [],
        allowMethods: [],
        autoIgnoreUnsupportedMethods: true,
        // Overide options
        ...options,
    };
}

/**
 * Build an blast api upstream
 */
export function buildBlastApiUpstream({
    id = "blastApi",
    apiKey,
    ...options
}: {
    id?: string;
    apiKey: string;
} & UpstreamOverride<EIP1474Methods>): UpstreamConfig {
    return {
        // Base stuff
        id,
        endpoint: `blastapi://${apiKey}`,
        type: "evm+blastapi",
        rateLimitBudget: options.rateLimitBudget ?? "",
        // Generic stuff
        vendorName: "Drpc",
        ignoreMethods: [],
        allowMethods: [],
        autoIgnoreUnsupportedMethods: true,
        // Overide options
        ...options,
    };
}

/**
 * Build a pimlico upstream
 */
export function buildPimlicoUpstream({
    id = "pimlico",
    apiKey = "public",
    ...options
}: {
    id?: string;
    apiKey?: string;
} & UpstreamOverride<PimlicoRpcSchema>): UpstreamConfig {
    return {
        // Base stuff
        id,
        endpoint: `pimlico://${apiKey}`,
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
 * Build a regular evm upstream
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

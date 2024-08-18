import type { PublicRpcSchema, RpcSchema } from "viem";
import {
    type AuthStrategyConfig,
    AuthTypeJwt,
    AuthTypeNetwork,
    AuthTypeSecret,
    AuthTypeSiwe,
    type JwtStrategyConfig,
    type NetworkStrategyConfig,
    type SecretStrategyConfig,
    type SiweStrategyConfig,
} from "./generatedTypes/erpcTypes";
import type { RpcMethodWithRegex } from "./types/rpc";

type AuthStrategyBaseConfig<TRpc extends RpcSchema> = {
    allowMethods?: RpcMethodWithRegex<TRpc>[];
    ignoreMethods?: RpcMethodWithRegex<TRpc>[];
    rateLimitBudget?: string;
};

/**
 * Build a network auth strategy
 * @default allowMethods: ["*"]
 * @default ignoreMethods: []
 * @default rateLimitBudget: ""
 */
export function buildNetworkAuthStrategy<
    TRpc extends RpcSchema = PublicRpcSchema,
>({
    network,
    ...baseOptions
}: AuthStrategyBaseConfig<TRpc> & {
    network: NetworkStrategyConfig;
}): AuthStrategyConfig {
    return {
        allowMethods: baseOptions.allowMethods ?? ["*"],
        ignoreMethods: baseOptions.ignoreMethods ?? [],
        rateLimitBudget: baseOptions.rateLimitBudget ?? "",
        type: AuthTypeNetwork,
        network,
    };
}

/**
 * Build a secret auth strategy
 * @default allowMethods: ["*"]
 * @default ignoreMethods: []
 * @default rateLimitBudget: ""
 */
export function buildSecretAuthStrategy<
    TRpc extends RpcSchema = PublicRpcSchema,
>({
    secret,
    ...baseOptions
}: AuthStrategyBaseConfig<TRpc> & {
    secret: SecretStrategyConfig;
}): AuthStrategyConfig {
    return {
        allowMethods: baseOptions.allowMethods ?? ["*"],
        ignoreMethods: baseOptions.ignoreMethods ?? [],
        rateLimitBudget: baseOptions.rateLimitBudget ?? "",
        type: AuthTypeSecret,
        secret,
    };
}

/**
 * Build a jwt auth strategy
 * @default allowMethods: ["*"]
 * @default ignoreMethods: []
 * @default rateLimitBudget: ""
 */
export function buildJwtAuthStrategy<TRpc extends RpcSchema = PublicRpcSchema>({
    jwt,
    ...baseOptions
}: AuthStrategyBaseConfig<TRpc> & {
    jwt: JwtStrategyConfig;
}): AuthStrategyConfig {
    return {
        allowMethods: baseOptions.allowMethods ?? ["*"],
        ignoreMethods: baseOptions.ignoreMethods ?? [],
        rateLimitBudget: baseOptions.rateLimitBudget ?? "",
        type: AuthTypeJwt,
        jwt,
    };
}

/**
 * Build a siwe auth strategy
 * @default allowMethods: ["*"]
 * @default ignoreMethods: []
 * @default rateLimitBudget: ""
 */
export function buildSiweAuthStrategy<
    TRpc extends RpcSchema = PublicRpcSchema,
>({
    siwe,
    ...baseOptions
}: AuthStrategyBaseConfig<TRpc> & {
    siwe: SiweStrategyConfig;
}): AuthStrategyConfig {
    return {
        allowMethods: baseOptions.allowMethods ?? ["*"],
        ignoreMethods: baseOptions.ignoreMethods ?? [],
        rateLimitBudget: baseOptions.rateLimitBudget ?? "",
        type: AuthTypeSiwe,
        siwe,
    };
}

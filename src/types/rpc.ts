import type { EIP1474Methods, RpcSchema } from "viem";

/**
 * Split every rpc method by a '_' and combine them with a *
 */
export type RpcMethodSplitted<TRpc extends RpcSchema> =
    TRpc[number]["Method"] extends `${infer Prefix}_${string}`
        ? `${Prefix}_*`
        : never;

/**
 * Type that accept any method of an rpc schema, a combinaison of methods splitted by a '_' and combined with a * or a *
 */
export type RpcMethodWithRegex<TRpc extends RpcSchema> =
    | TRpc[number]["Method"]
    | RpcMethodSplitted<TRpc>
    | "*"
    | (string & {});

/**
 * List of all the bundlers specifics methods
 */
export const bundlersMethods: RpcMethodWithRegex<EIP1474Methods>[] = [
    "eth_estimateUserOperationGas",
    "eth_getUserOperationByHash",
    "eth_getUserOperationReceipt",
    "eth_sendUserOperation",
    "eth_supportedEntryPoints",
];

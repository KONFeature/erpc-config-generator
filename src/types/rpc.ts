import type { RpcSchema } from "viem";

/**
 * Extract rpc method prefix from a schema and add a * to them
 */
export type RpcMethodGenerics<TRpc extends RpcSchema> =
    TRpc[number]["Method"] extends `${infer Prefix}_${string}`
        ? `${Prefix}_*`
        : never;

/**
 * Generic types to accept rpc methods from a schema.
 */
export type RpcMethod<TRpc extends RpcSchema> =
    | TRpc[number]["Method"]
    | RpcMethodGenerics<TRpc>
    | "*"
    | (string & {});

/**
 * Generic types for any combinaison of rpc methods splitted by a '_' and combined with a *
 */
export type RpcMethodCombinaison<TRpc extends RpcSchema> =
    `${RpcMethod<TRpc>}${"" | `_${RpcMethod<TRpc>}`}`;

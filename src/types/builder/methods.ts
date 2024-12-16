import type {
    BundlerRpcSchema,
    PaymasterRpcSchema,
    Prettify,
    PublicRpcSchema,
    RpcSchema,
} from "viem";
// todo: not exported anymore, should do a PR to fix it
// import type { PimlicoRpcSchema as InitialPimlicoRpcSchema } from "permissionless/types";

/**
 * Type that accept any method of an rpc schema, a combinaison of methods splitted by a '_' and combined with a * or a *
 */
export type MatcherRpcMethodOrString<TRpc extends RpcSchema> =
    | MatcherRpcMethod<TRpc>
    | (string & {});

/**
 * Type that accept any method of an rpc schema, a combinaison of methods splitted by a '_' and combined with a * or a *
 *  todo: Should be broader to match the [Matcher syntax](https://docs.erpc.cloud/config/matcher)
 * todo: Missing full `*` support (but could be a pain in term of type completion and IDE performance)
 * todo: Missing operators supports `|`, `&`, `()`
 */
export type MatcherRpcMethod<TRpc extends RpcSchema> =
    | TRpc[number]["Method"]
    | RpcMethodSplitted<TRpc>
    | `!${TRpc[number]["Method"]}`
    | `!${RpcMethodSplitted<TRpc>}`
    | "*";

/**
 * Split every rpc method by a '_' and combine them with a *
 */
export type RpcMethodSplitted<TRpc extends RpcSchema> =
    TRpc[number]["Method"] extends `${infer Prefix}_${string}`
        ? `${Prefix}_*`
        : never;

/**
 * The envio rpc schema is the public one, with only the supported methods
 *  from: https://docs.envio.dev/docs/HyperSync/overview-hyperrpc
 */
export type EnvioRpcSchema = Prettify<
    Extract<
        PublicRpcSchema[number],
        {
            Method:
                | "eth_chainId"
                | "eth_blockNumber"
                | "eth_getBlockByNumber"
                | "eth_getBlockByHash"
                | "eth_getTransactionByHash"
                | "eth_getTransactionByBlockHashAndIndex"
                | "eth_getTransactionByBlockNumberAndIndex"
                | "eth_getTransactionReceipt"
                | "eth_getBlockReceipts"
                | "eth_getLogs"
                | "trace_block";
        }
    >
>[];

/**
 * Complete pimlico rpc schema
 */
export type PimlicoRpcSchema = [
    ...BundlerRpcSchema,
    ...PaymasterRpcSchema,
    // ...InitialPimlicoRpcSchema,
];

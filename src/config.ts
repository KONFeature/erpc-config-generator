import type { EIP1193Parameters } from "viem";
import type {
    Config,
    MetricsConfig,
    ServerConfig,
} from "./generatedTypes/erpcTypes";
import type { OptionalField } from "./types/utils";

/**
 * Config used to rate free rpc
 */
export type RpcBenchmarkConfig<TRpc extends undefined = undefined> = {
    // Print some debug data or not
    debug?: boolean;
    // Max latency in ms
    maxRpcLatencyInMs?: number;
    // Max number of rpc in the final list
    maxRpcCount?: number;
    // Tracking limitation for the rpc?
    tracking?: "yes" | "limited" | "none";
    // Some config about the benchmark
    benchmark?: {
        // Max timeout during test, if rpc exceed this time, it will be excluded
        rpcTimeoutInMs?: number;
        // Max number of retries during test
        retryCount?: number;
        // Delay between retries
        retryDelayInMs?: number;
        // Number of runs for the latency benchmark, default to 1
        runs?: number;
        // Interval between each runs in ms, default to 200ms
        runsIntervalInMs?: number;
        // Methods and params to test
        request?: EIP1193Parameters<TRpc>;
    };
};

type ConfigWithOptionalServer = Omit<Config, "server" | "metrics"> & {
    server?: OptionalField<
        ServerConfig,
        "httpPort" | "httpHostV4" | "httpHostV6" | "listenV4" | "listenV6"
    >;
    metrics?: OptionalField<
        MetricsConfig,
        "port" | "hostV4" | "hostV6" | "listenV4" | "listenV6"
    >;
};

// Default config for metrics and server
const defaultServerConfig = {
    httpPort: 4000,
    httpHostV4: "0.0.0.0",
    httpHostV6: "[::]",
    listenV4: true,
    listenV6: true,
};
const defaultMetricsCofnig = {
    port: 4001,
    hostV4: "0.0.0.0",
    hostV6: "[::]",
    listenV4: true,
    listenV6: true,
};

export type ErpcConfigWithStaticConfigs = Config & {
    freeRpcBenchmarkConfig?: (chainId: number) => Promise<RpcBenchmarkConfig>;
};

/**
 * Build the globel erpc config
 */
export function buildErpcConfig({
    config,
    freeRpcBenchmarkConfig,
}: {
    config: ConfigWithOptionalServer;
    // Free rpc benchmark config
    freeRpcBenchmarkConfig?: (chainId: number) => Promise<RpcBenchmarkConfig>;
}): ErpcConfigWithStaticConfigs {
    return {
        ...config,
        server: config?.server
            ? { ...defaultServerConfig, ...config.server }
            : undefined,
        metrics: config?.metrics
            ? { ...defaultMetricsCofnig, ...config.metrics }
            : undefined,
        // Default free rpc benchmark config
        freeRpcBenchmarkConfig,
    };
}

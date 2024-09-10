import { http, type Chain, type EIP1193Parameters } from "viem";
import type { RpcBenchmarkConfig } from "../../../config";

/**
 * Default timeout for rpcs
 */
const defaultTimeoutInMs = 5_000;

/**
 * Default request params
 */
const defaultRequestParams: EIP1193Parameters = {
    method: "eth_blockNumber",
    params: ["latest", false],
};

/**
 * Benchmark a list off rpcs
 */
export async function benchmarkRpcs({
    rpcs,
    chain,
    config,
}: {
    rpcs: string[];
    chain?: Chain;
    config?: RpcBenchmarkConfig["benchmark"];
}): Promise<{
    success: RpcBenchmarkResult[];
    failed: (RpcBenchmarkResult | undefined)[];
}> {
    // TODO: Handle multiple run with interval between them here
    // Build all the promises we will test
    const promises = rpcs.map((rpcUrl) => {
        return benchmarkRpc({
            rpcUrl,
            chain,
            config,
        });
    });

    // Wait for all of them to be settled
    const results = await Promise.allSettled(promises);

    // Filter the results
    const successResults = results
        .filter((r) => r.status === "fulfilled" && r.value.success)
        .map(
            (r) =>
                (r.status === "fulfilled"
                    ? r.value
                    : undefined) as RpcBenchmarkResult
        );
    const failedResults = results
        .filter((r) => r.status !== "fulfilled" || !r.value.success)
        .map((r) => (r.status === "fulfilled" ? r.value : undefined));

    // Return the results
    return {
        success: successResults,
        failed: failedResults,
    };
}

export type RpcBenchmarkResult = {
    rpcUrl: string;
    success: boolean;
    error?: Error;
    latency: number;
};

/**
 * Perform the rating over a free single rpc
 */
async function benchmarkRpc({
    rpcUrl,
    chain,
    config,
}: {
    rpcUrl: string;
    chain?: Chain;
    config?: RpcBenchmarkConfig["benchmark"];
}): Promise<RpcBenchmarkResult> {
    // Create the matching viem transport
    const transport = http(rpcUrl, {
        retryDelay: config?.retryDelayInMs,
        retryCount: config?.retryCount,
        timeout: config?.rpcTimeoutInMs ?? defaultTimeoutInMs,
    })({ chain });

    const params = config?.request || defaultRequestParams;

    // Perform the rpc call and measure the performance
    const start = performance.now();
    try {
        await transport.request(params);
        const duration = performance.now() - start;
        return {
            rpcUrl,
            success: true,
            latency: duration,
        };
    } catch (e) {
        return {
            rpcUrl,
            success: false,
            error: e as Error,
            latency: -1,
        };
    }
}

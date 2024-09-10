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

export type RpcBenchmarkResult = {
    rpcUrl: string;
    avgLatency: number;
    runs: RunResult[];
};

type RunResult =
    | {
          success: true;
          latency: number;
      }
    | {
          success: false;
          error: Error;
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
    failed: RpcBenchmarkResult[];
}> {
    // Build all the promises we will test
    const promises = rpcs.map((rpcUrl) => {
        return benchmarkRpc({
            rpcUrl,
            chain,
            config,
        });
    });

    // Wait for all of them to be settled
    const results = await Promise.all(promises);

    // Filter the results
    const successResults = results.filter((r) => r.avgLatency !== -1);
    const failedResults = results.filter((r) => r.avgLatency === -1);

    // Return the results
    return {
        success: successResults,
        failed: failedResults,
    };
}

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
    // Create the viem transport we will use for benchmark
    const transport = http(rpcUrl, {
        retryDelay: config?.retryDelayInMs,
        retryCount: config?.retryCount,
        timeout: config?.rpcTimeoutInMs ?? defaultTimeoutInMs,
    })({ chain });

    const params = config?.request || defaultRequestParams;

    // Do the multi run benchmark
    const multirun = await multiRunBenchmark({
        doRequest: () => transport.request(params),
        runs: config?.runs ?? 1,
        runsIntervalInMs: config?.runsIntervalInMs ?? 0,
    });

    // Filter the results
    const successRuns = multirun.filter((r) => r.success) as {
        latency: number;
    }[];

    // Compute the average latency
    const avgLatency =
        successRuns.length !== 0
            ? successRuns.reduce((acc, r) => acc + r.latency, 0) /
              successRuns.length
            : -1;

    // Perform the rpc call and measure the performance
    return {
        rpcUrl,
        avgLatency,
        runs: multirun,
    };
}

/**
 * Perform a benchmark on a single rpc, over multiple runs
 */
async function multiRunBenchmark({
    doRequest,
    runs,
    runsIntervalInMs,
}: {
    doRequest: () => Promise<unknown>;
    runs: number;
    runsIntervalInMs: number;
}): Promise<RunResult[]> {
    const results: RunResult[] = [];

    for (let i = 0; i < runs; i++) {
        // Perform the rpc call and measure the performance
        const start = performance.now();
        try {
            await doRequest();
            const duration = performance.now() - start;
            results.push({ latency: duration, success: true });
        } catch (e) {
            results.push({
                success: false,
                error: e as Error,
            });
            continue;
        }
        // Directly exit if we are on the last run
        if (i === runs - 1) break;
        // Wait for the interval
        await new Promise((resolve) => setTimeout(resolve, runsIntervalInMs));
    }
    return results;
}

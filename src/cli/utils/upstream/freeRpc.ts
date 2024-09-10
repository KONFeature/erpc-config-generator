import {
    type HandlerConstructorConfig,
    type NetworkId,
    RPCHandler,
} from "@ubiquity-dao/rpc-handler";
import { print } from "gluegun";
import * as allChains from "viem/chains";
import type { Chain } from "viem/chains";
import type { RpcBenchmarkConfig } from "../../../config";
import { type RpcBenchmarkResult, benchmarkRpcs } from "./rpcBenchmark";

const baseRpcHandlerConfig: Omit<HandlerConstructorConfig, "networkId"> = {
    networkName: null,
    networkRpcs: null,
    runtimeRpcs: null,
    autoStorage: false,
    cacheRefreshCycles: 1,
    rpcTimeout: 1,
    proxySettings: {
        retryCount: 1,
        retryDelay: 1,
        logTier: "none",
        logger: null,
        strictLogs: false,
    },
};

/**
 * Method to fetch all the "best" free rpc services for a given chain
 * We will be using `@ubiquity-dao/rpc-handler` to fetch rpcs fron chainlist + perform a benchmark
 *  totally overkill tool, but fastet way to get this test done
 */
export async function getFreeRpcUrlsForChain({
    chainId,
    configResolver,
}: { chainId: number; configResolver?: Promise<RpcBenchmarkConfig> }) {
    const spinner = print.spin({
        prefixText: `[RPCs benchmark on ${chainId}]`,
        text: "Resolving the benchmark config",
    });

    // Fetch the benchmark config
    const config = await configResolver;

    // Create our handler config
    const handlerConfig: HandlerConstructorConfig = {
        networkId: chainId.toString() as NetworkId,
        tracking: config?.tracking,
        ...baseRpcHandlerConfig,
    };

    // Create the handler
    //  todo: just used to fetch rpcs, and perform the tracking filtering, not needed in the long run
    const handler = new RPCHandler(handlerConfig);

    // Fetch every rpcs
    const rpcs = handler.getNetworkRpcs().map((rpc) => rpc.url);

    // Find the viem chain
    const chain = Object.values(allChains).find((c) => c.id === chainId);

    // Perform the benchmark
    const results = await benchmarkRpcs({
        rpcs,
        chain,
        config: config?.benchmark,
    });

    spinner.succeed(`Performance test done for  ${rpcs.length} rpcs`);

    // Sort the success results by latency
    let finalResults = results.success.sort((a, b) => a.latency - b.latency);

    // If we got a naxRpcLatencyInMs, filter the results
    const maxLatency = config?.maxRpcLatencyInMs;
    if (maxLatency) {
        finalResults = finalResults.filter((r) => r.latency < maxLatency);
    }

    // If we got a maxRpcCount, filter the results
    if (config?.maxRpcCount) {
        finalResults = finalResults.slice(0, config.maxRpcCount);
    }

    print.info(
        ` - Found ${finalResults.length} rpcs matching all the criteria for ${chainId}`
    );

    if (config?.debug) {
        printDebugData({
            chainId,
            chain,
            results,
            rpcUrls: rpcs,
            finalResults,
        });
    }

    // Return the 15 best rpcs
    return finalResults.map((r) => r.rpcUrl);
}

function printDebugData({
    chainId,
    chain,
    results,
    rpcUrls,
    finalResults,
}: {
    chainId: number;
    chain?: Chain;
    rpcUrls: string[];
    results: {
        success: RpcBenchmarkResult[];
        failed: (RpcBenchmarkResult | undefined)[];
    };
    finalResults: RpcBenchmarkResult[];
}) {
    print.info(`Debug data for chain ${chain?.name ?? chainId} (${chainId})`);
    print.info(` - Initial rpcs: ${rpcUrls.length}`);
    print.info(` - Success rpcs: ${results.success.length}`);
    print.info(` - Failed rpcs: ${results.failed.length}`);
    print.info(` - Final rpcs: ${finalResults.length}`);

    // Create the table for the success rpcs
    const successTable = results.success.map((r) => [
        r.rpcUrl,
        `${r.latency.toFixed(4)}ms`,
    ]);
    successTable.unshift(["RPC URL", "Latency"]);
    print.divider();
    print.info("Success RPCs:");
    print.table(successTable, {
        format: "lean",
    });

    // Create the one for the failed rpcs
    const failedTable = results.failed.map((r) => [
        r?.rpcUrl ?? "Unknown",
        r?.error?.message ?? "Unknown",
    ]);
    failedTable.unshift(["RPC URL", "Error"]);
    print.divider();
    print.info("Failed RPCs:");
    print.table(failedTable, {
        format: "lean",
    });

    // Create the one for the final rpcs
    const finalTable = finalResults.map((r) => [
        r.rpcUrl,
        `${r.latency.toFixed(4)}ms`,
    ]);
    finalTable.unshift(["RPC URL", "Latency"]);
    print.divider();
    print.info("Final RPCs:");
    print.table(finalTable, {
        format: "lean",
    });
}

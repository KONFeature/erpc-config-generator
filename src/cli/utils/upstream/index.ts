import {
    type HandlerConstructorConfig,
    type NetworkId,
    RPCHandler,
} from "@ubiquity-dao/rpc-handler";
import { print } from "gluegun";

const baseRpcHandlerConfig: Omit<HandlerConstructorConfig, "networkId"> = {
    networkName: null,
    networkRpcs: null,
    runtimeRpcs: null,
    autoStorage: false, // Not compatible with the free rpcs
    cacheRefreshCycles: 10, // bad RPCs are excluded if they fail, this is how many cycles before they're re-tested
    rpcTimeout: 1500, // max time to allow for a response. todo: should be configurable
    tracking: "yes", //"yes" | "limited" | "none". todo: should be configurable
    proxySettings: {
        retryCount: 5, // todo: should be configurable
        retryDelay: 200, // todo: should be configurable
        logTier: "info", // |"info"|"error"|"debug"|"fatal"|"verbose"; set to "none" for no logs, null will default to "error", "verbose" will log all
        logger: null, // null will default to PrettyLogs todo: should use gluegun prints
        strictLogs: false, // true, only the specified logTier will be logged and false all wll be logged.
        moduleName: "[RPC Tester]", // Can be omitted. this is the prefix for the logs.
    },
};

/**
 * Method to fetch all the "best" free rpc services for a given chain
 *    - Best are upstream with latency < 500ms
 *    - Max 10 upstream will be returned
 * We will be using `@ubiquity-dao/rpc-handler` to fetch rpcs and latencies
 *  totally overkill tool, but fastet way to get this test done
 */
export async function getFreeUpstreamsForChain({
    chainId,
}: { chainId: number }) {
    const spinner = print.spin(
        `Fetching the best free rpcs for chain ${chainId}`
    );

    // Create our handler config
    const config: HandlerConstructorConfig = {
        networkId: chainId.toString() as NetworkId, // your chosen networkId
        ...baseRpcHandlerConfig,
    };

    // Create the handler and start to test the performace
    const handler = new RPCHandler(config);
    await handler.testRpcPerformance();
    spinner.succeed(
        `Performance test done on ${handler.getNetworkRpcs().length} rpcs`
    );

    // Get all the computed latencies
    const latencies = handler.getLatencies();

    // Latencies array in ms in an array of objects { url: latency }
    const validLatencies: Record<string, number> = Object.entries(latencies)
        .filter(([key]) => key.startsWith(`${chainId}__`))
        .sort(([, a], [, b]) => a - b)
        .reduce(
            (acc, [key, value]) => {
                const url = key.split("__")[1];
                acc[url] = value;
                return acc;
            },
            {} as Record<string, number>
        );

    // Find every rpc under 500ms, and get the 10 first one
    const bestRpcs = Object.entries(validLatencies)
        .filter(([, latency]) => latency < 500)
        .map(([url]) => url);

    print.info(`Found ${bestRpcs.length} total rpcs under 500ms`);

    // Return the 10 best rpcs
    return bestRpcs.slice(0, 10);
}

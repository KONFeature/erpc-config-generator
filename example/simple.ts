import { http, createClient, toHex } from "viem";
import { getBlock } from "viem/actions";
import {
    arbitrum,
    arbitrumSepolia,
    optimism,
    optimismSepolia,
    polygon,
    polygonAmoy,
} from "viem/chains";
import * as allChains from "viem/chains";
import {
    buildAlchemyUpstream,
    buildEnvioUpstream,
    buildErpcConfig,
    buildEvmNetworks,
    buildProject,
    envVariable,
} from "../src";
import { buildFreeUpstreams } from "../src/upstreams";

/* -------------------------------------------------------------------------- */
/*              1. Create everything you will need in your config             */
/* -------------------------------------------------------------------------- */

const alchemyUpstream = buildAlchemyUpstream({
    apiKey: envVariable("ALCHEMY_API_KEY"),
    failsafe: {
        timeout: {
            duration: "15s",
        },
        retry: {
            maxAttempts: 2,
            delay: "1000ms",
            backoffMaxDelay: "10s",
            backoffFactor: 0.3,
            jitter: "500ms",
        },
    },
});

const envioUpstream = buildEnvioUpstream();

const networks = buildEvmNetworks({
    chains: [arbitrumSepolia, polygonAmoy, optimismSepolia],
});

/* -------------------------------------------------------------------------- */
/*                       2. Create config and export it                       */
/* -------------------------------------------------------------------------- */

export default buildErpcConfig({
    config: {
        logLevel: "warn",
        database: {
            evmJsonRpcCache: {
                driver: "postgresql",
                postgresql: {
                    connectionUri: envVariable("ERPC_DATABASE_URL"),
                    table: "rpc_cache",
                },
            },
        },
        projects: [
            buildProject({
                id: "simple-erpc",
                networks,
                upstreams: [alchemyUpstream, envioUpstream],
            }),
            buildProject({
                id: "free-erpc",
                networks,
                upstreams: buildFreeUpstreams({
                    chains: [polygon, polygonAmoy, arbitrum, optimism],
                }),
            }),
        ],
    },
    // Properties for the rating of free rpc
    //  Here we will perform the rpc benchmark on the eth_getLogs method, with from block being close to the latest block
    freeRpcBenchmarkConfig: async (chainId) => {
        // Get the latest block for the given chain id
        const chain = Object.values(allChains).find((c) => c.id === chainId);
        if (!chain) {
            throw new Error(`Chain ${chainId} not found`);
        }
        const latestBlock = await getBlock(
            // Create a dummy client
            createClient({ chain, transport: http() }),
            // Fetch the latest block
            { blockTag: "latest" }
        );

        return {
            debug: true,
            maxRpcLatencyInMs: 1000, // optional
            maxRpcCount: 10, // optional
            tracking: "yes", // optional (tracking params extracted to the chainlist params)
            benchmark: {
                retryCount: 1,
                retryDelayInMs: 1000,
                rpcTimeoutInMs: 5000,
                runs: 1,
                runsIntervalInMs: 200,
                request: {
                    method: "eth_getLogs",
                    params: [{ fromBlock: toHex(latestBlock.number) }],
                },
            },
        };
    },
});

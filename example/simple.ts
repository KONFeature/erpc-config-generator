import { arbitrumSepolia, optimismSepolia, polygonAmoy } from "viem/chains";
import {
    buildAlchemyUpstream,
    buildEnvioUpstream,
    buildErpcConfig,
    buildEvmNetworks,
    buildProject,
    envVariable,
} from "../src";

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
        ],
    },
});

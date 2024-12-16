import { arbitrumSepolia, optimismSepolia, polygonAmoy } from "viem/chains";
import {
    buildAlchemyUpstream,
    buildEnvioUpstream,
    buildEvmNetworks,
    initErpcConfig,
} from "../dist";

/* -------------------------------------------------------------------------- */
/*              1. Create everything you will need in your config             */
/* -------------------------------------------------------------------------- */

const alchemyUpstream = buildAlchemyUpstream({
    apiKey: process.env.ALCHEMY_API_KEY ?? "",
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

export default initErpcConfig({
    logLevel: "warn",
    database: {
        evmJsonRpcCache: {
            connectors: [
                {
                    id: "main-pg",
                    driver: "postgresql",
                    postgresql: {
                        connectionUri: process.env.ERPC_DATABASE_URL ?? "",
                        table: "rpc_cache",
                    },
                },
            ],
        },
    },
})
    .addProject({
        id: "simple-erpc",
        networks,
        upstreams: [alchemyUpstream, envioUpstream],
    })
    .build();

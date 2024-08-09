import { arbitrumSepolia, optimismSepolia, polygonAmoy } from "viem/chains";
import {
    type Config,
    type NetworkConfig,
    type RateLimitBudgetConfig,
    createErpcConfig,
    envVariable,
    getAlchemyUpstream,
    getEnvioUpstream,
    getEvmNetworks,
} from "../src";

/* -------------------------------------------------------------------------- */
/*              1. Create everything you will need in your config             */
/* -------------------------------------------------------------------------- */

const rateLimitBudget: RateLimitBudgetConfig = {
    id: "simple-rate-limit",
    rules: [
        {
            method: "*",
            maxCount: 5,
            period: "1s",
            waitTime: "0ms",
        },
    ],
};

const alchemyUpstream = getAlchemyUpstream({
    endpoint: `evm+alchemy://${envVariable("ALCHEMY_API_KEY")}`,
    rateLimitBudget: rateLimitBudget.id,
    options: {
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
    },
});

const envioUpstream = getEnvioUpstream({
    rateLimitBudget: rateLimitBudget.id,
});

const networks = getEvmNetworks({
    chains: [arbitrumSepolia, polygonAmoy, optimismSepolia],
    generic: {
        rateLimitBudget: rateLimitBudget.id,
    },
});

/* -------------------------------------------------------------------------- */
/*                            2. Create your config                           */
/* -------------------------------------------------------------------------- */

const config: Config = {
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
        {
            id: "simple-erpc",
            networks,
            upstreams: [alchemyUpstream, envioUpstream],
            rateLimitBudget: rateLimitBudget.id,
        },
    ],
    rateLimiters: {
        budgets: [rateLimitBudget],
    },
};

/* -------------------------------------------------------------------------- */
/*                            3. Write your config                            */
/* -------------------------------------------------------------------------- */

createErpcConfig(config, "example/simple.yaml");

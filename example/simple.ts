
import { createErpcConfig, envVariable, type Config, type NetworkConfig, type UpstreamConfig, type RateLimitBudgetConfig } from "../src";

/* -------------------------------------------------------------------------- */
/*              1. Create everything you will need in your config             */
/* -------------------------------------------------------------------------- */

const rateLimitBudget: RateLimitBudgetConfig = {
    id: "simple-rate-limit",
    rules: [{
        method: "*",
        maxCount: 5,
        period: "1s",
        waitTime: "0ms"
    }],
}

const alchemyUpstream: UpstreamConfig = {
    id: "alchemy",
    endpoint: `evm+alchemy://${envVariable("ALCHEMY_API_KEY")}`,
    type: "evm+alchemy",
    vendorName: "Alchemy",
    ignoreMethods: [],
    allowMethods: ["*"],
    failsafe: {
        timeout: {
            duration: "15s"
        },
        retry: {
            maxAttempts: 2,
            delay: "1000ms",
            backoffMaxDelay: "10s",
            backoffFactor: 0.3,
            jitter: "500ms"
        }
    },
    rateLimitBudget: rateLimitBudget.id,
    autoIgnoreUnsupportedMethods: true,
}

const envioUpstream: UpstreamConfig = {
    id: "envio",
    endpoint: "evm+envio://rpc.hypersync.xyz",
    type: "evm+envio",
    vendorName: "Envio",
    ignoreMethods: [],
    allowMethods: ["*"],
    rateLimitBudget: rateLimitBudget.id,
    autoIgnoreUnsupportedMethods: true,
}

const arbitrumSepoliaNetwork: NetworkConfig = {
    architecture: "evm",
    evm: {
        chainId: 421614,
        finalityDepth: 8,
        blockTrackerInterval: "500ms"
    },
    rateLimitBudget: rateLimitBudget.id
}

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
                table: "rpc_cache"
            }
        }
    },
    projects: [{
        id: "simple-erpc",
        networks: [arbitrumSepoliaNetwork],
        upstreams: [alchemyUpstream, envioUpstream],
        rateLimitBudget: "simple-rate-limit"
    }],
    rateLimiters: {
        budgets: [rateLimitBudget]
    }
}

/* -------------------------------------------------------------------------- */
/*                            3. Write your config                            */
/* -------------------------------------------------------------------------- */

createErpcConfig(config, "example/simple.yaml");
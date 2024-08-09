import {
    arbitrum,
    arbitrumSepolia,
    base,
    baseSepolia,
    optimism,
    optimismSepolia,
    polygon,
} from "viem/chains";
import {
    type Config,
    type ProjectConfig,
    createErpcConfig,
    envVariable,
    getAlchemyUpstream,
    getEnvioUpstream,
    getEvmNetworks,
    getRateLimit,
} from "../dist";

/* -------------------------------------------------------------------------- */
/*                  Config generator for the Frak eRPC config                 */
/* -------------------------------------------------------------------------- */

// Build every rate limits
const networkRateLimits = getRateLimit({
    id: "network-rate-limit",
    rules: [
        {
            method: "*",
            maxCount: 10_000,
            period: "3s",
        },
    ],
});
const envioRateLimits = getRateLimit({
    id: "envio-rate-limit",
    rules: [
        {
            method: "*",
            maxCount: 1_000,
            period: "1s",
        },
    ],
});
const alchemyRateLimits = getRateLimit({
    id: "alchemy-rate-limit",
    rules: [
        {
            method: "*",
            maxCount: 200,
            period: "1s",
        },
    ],
});

// Each networks we will use
// todo: different rate limits for testnet and prod environment
const networks = getEvmNetworks({
    chains: [
        arbitrumSepolia,
        optimismSepolia,
        baseSepolia,
        polygon,
        arbitrum,
        optimism,
        base,
    ],
    generic: {
        // The rate limit rules
        rateLimitBudget: networkRateLimits.id,
        // Some failsafe config
        failsafe: {
            timeout: {
                duration: "30s",
            },
            retry: {
                maxAttempts: 5,
                delay: "500ms",
                backoffMaxDelay: "10s",
                backoffFactor: 0.5,
                jitter: "200ms",
            },
            hedge: {
                delay: "1s",
                maxCount: 2,
            },
        },
    },
});

// Build each upstream we will use
const upstreams = [
    getEnvioUpstream({
        rateLimitBudget: envioRateLimits.id,
    }),
    getAlchemyUpstream({
        endpoint: `evm+alchemy://${envVariable("ALCHEMY_API_KEY")}`,
        rateLimitBudget: alchemyRateLimits.id,
    }),
];

// Build the ponder indexing project
const ponderProject: ProjectConfig = {
    id: "ponder-rpc",
    networks,
    upstreams,
};

// Build the nexus rpc project
// todo: add authentication + more restrictie cors origin
const nexusProject: ProjectConfig = {
    id: "nexus-rpc",
    networks,
    upstreams,
    cors: {
        allowedOrigins: ["*"],
        allowedMethods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["X-Request-ID"],
        allowCredentials: true,
        maxAge: 3600,
    },
};

// Build the global config
const config: Config = {
    logLevel: envVariable("ERPC_LOG_LEVEL"),
    database: {
        evmJsonRpcCache: {
            driver: "postgresql",
            postgresql: {
                connectionUri: envVariable("ERPC_DATABASE_URL"),
                table: "rpc_cache",
            },
        },
    },
    server: {
        httpHost: "0.0.0.0",
        httpPort: 8080,
        maxTimeout: "60s",
    },
    metrics: {
        enabled: true,
        host: "0.0.0.0",
        port: 4001,
    },
    projects: [ponderProject, nexusProject],
    rateLimiters: {
        budgets: [networkRateLimits, envioRateLimits, alchemyRateLimits],
    },
};

createErpcConfig(config, "example/frak.yaml");

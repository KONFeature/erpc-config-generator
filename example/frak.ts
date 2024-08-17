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
    buildAlchemyUpstream,
    buildEnvioUpstream,
    buildEvmNetworks,
    buildPimlicoUpstream,
    envVariable,
    getRateLimit,
    writeErpcConfig,
} from "../dist";

/* -------------------------------------------------------------------------- */
/*                  Config generator for the Frak eRPC config                 */
/* -------------------------------------------------------------------------- */

// Build every rate limits
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
const pimlicoRateLimits = getRateLimit({
    id: "pimlico-rate-limit",
    rules: [
        {
            method: "*",
            maxCount: 400,
            period: "1s",
        },
    ],
});

// Each networks we will use
// todo: different rate limits for testnet and prod environment
const networks = buildEvmNetworks({
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
    buildEnvioUpstream({
        rateLimitBudget: envioRateLimits.id,
    }),
    buildAlchemyUpstream({
        endpoint: `evm+alchemy://${envVariable("ALCHEMY_API_KEY")}`,
        rateLimitBudget: alchemyRateLimits.id,
    }),
];
const pimlicoUpstream = buildPimlicoUpstream({
    endpoint: `pimlico://${envVariable("PIMLICO_API_KEY")}`,
    rateLimitBudget: pimlicoRateLimits.id,
});

// Build the ponder indexing project
const ponderProject: ProjectConfig = {
    id: "ponder-rpc",
    networks,
    upstreams,
    rateLimitBudget: "",
};

// Build the nexus rpc project
// todo: add authentication + more restrictie cors origin
const nexusProject: ProjectConfig = {
    id: "nexus-rpc",
    networks,
    upstreams: [...upstreams, pimlicoUpstream],
    cors: {
        allowedOrigins: ["*"],
        allowedMethods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["X-Request-ID"],
        allowCredentials: true,
        maxAge: 3600,
    },
    rateLimitBudget: "",
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
        budgets: [envioRateLimits, alchemyRateLimits, pimlicoRateLimits],
    },
};

writeErpcConfig(config, "example/frak.yaml");

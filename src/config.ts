import type {
    Config,
    MetricsConfig,
    ServerConfig,
} from "./generatedTypes/erpcTypes";
import type { OptionalField } from "./types/utils";

type ConfigWithOptionalServer = Omit<Config, "server" | "metrics"> & {
    server?: OptionalField<
        ServerConfig,
        "httpPort" | "httpHostV4" | "httpHostV6" | "listenV4" | "listenV6"
    >;
    metrics?: OptionalField<
        MetricsConfig,
        "port" | "hostV4" | "hostV6" | "listenV4" | "listenV6"
    >;
};

// Default config for metrics and server
const defaultServerConfig = {
    httpPort: 4000,
    httpHostV4: "0.0.0.0",
    httpHostV6: "[::]",
    listenV4: true,
    listenV6: true,
};
const defaultMetricsCofnig = {
    port: 4001,
    hostV4: "0.0.0.0",
    hostV6: "[::]",
    listenV4: true,
    listenV6: true,
};

/**
 * Build the globel erpc config
 */
export function buildErpcConfig({
    config,
}: { config: ConfigWithOptionalServer }) {
    return {
        ...config,
        server: config?.server
            ? { ...defaultServerConfig, ...config.server }
            : undefined,
        metrics: config?.metrics
            ? { ...defaultMetricsCofnig, ...config.metrics }
            : undefined,
    };
}

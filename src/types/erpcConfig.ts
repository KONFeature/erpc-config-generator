/*
 * Gen via: https://stirlingmarketinggroup.github.io/go2ts/
 * todo: Tygo (https://github.com/gzuidhof/tygo), doesn't seems to work atm
 *
 * todo: Should have a mapping of of key to yaml types (from the initial config)
 */

export interface Config {
    LogLevel: string;
    Server?: ServerConfig;
    Database?: DatabaseConfig;
    Projects: (ProjectConfig | undefined)[];
    RateLimiters?: RateLimiterConfig;
    Metrics?: MetricsConfig;
}

export interface ServerConfig {
    HttpHost: string;
    HttpPort: number;
    MaxTimeout: string;
}

export interface DatabaseConfig {
    EvmJsonRpcCache?: ConnectorConfig;
    EvmBlockIngestions?: ConnectorConfig;
    RateLimitSnapshots?: ConnectorConfig;
}

export interface ConnectorConfig {
    Driver: string;
    Memory?: MemoryConnectorConfig;
    Redis?: RedisConnectorConfig;
    DynamoDB?: DynamoDBConnectorConfig;
    PostgreSQL?: PostgreSQLConnectorConfig;
}

export interface MemoryConnectorConfig {
    MaxItems: number;
}

export interface RedisConnectorConfig {
    Addr: string;
    Password: string;
    DB: number;
}

export interface DynamoDBConnectorConfig {
    Table: string;
    Region: string;
    Endpoint: string;
    Auth?: AwsAuthConfig;
    PartitionKeyName: string;
    RangeKeyName: string;
    ReverseIndexName: string;
}

export interface PostgreSQLConnectorConfig {
    ConnectionUri: string;
    Table: string;
}

export interface AwsAuthConfig {
    Mode: string;
    CredentialsFile: string;
    Profile: string;
    AccessKeyID: string;
    SecretAccessKey: string;
}

export interface ProjectConfig {
    Id: string;
    Auth?: AuthConfig;
    CORS?: CORSConfig;
    Upstreams: (UpstreamConfig | undefined)[];
    Networks: (NetworkConfig | undefined)[];
    RateLimitBudget: string;
    HealthCheck?: HealthCheckConfig;
}

export interface CORSConfig {
    AllowedOrigins: string[];
    AllowedMethods: string[];
    AllowedHeaders: string[];
    ExposedHeaders: string[];
    AllowCredentials: boolean;
    MaxAge: number;
}

export type UpstreamType = string;

export interface UpstreamConfig {
    Id: string;
    Type: UpstreamType;
    VendorName: string;
    Endpoint: string;
    Evm?: EvmUpstreamConfig;
    JsonRpc?: JsonRpcUpstreamConfig;
    IgnoreMethods: string[];
    AllowMethods: string[];
    AutoIgnoreUnsupportedMethods: boolean;
    Failsafe?: FailsafeConfig;
    RateLimitBudget: string;
}

export interface JsonRpcUpstreamConfig {
    SupportsBatch?: boolean;
    BatchMaxSize: number;
    BatchMaxWait: string;
}

export type EvmNodeType = string;

export interface EvmUpstreamConfig {
    ChainId: number;
    NodeType: EvmNodeType;
    Engine: string;
    GetLogsMaxBlockRange: number;
    Syncing: boolean;
}

export interface FailsafeConfig {
    Retry?: RetryPolicyConfig;
    CircuitBreaker?: CircuitBreakerPolicyConfig;
    Timeout?: TimeoutPolicyConfig;
    Hedge?: HedgePolicyConfig;
}

export interface RetryPolicyConfig {
    MaxAttempts: number;
    Delay: string;
    BackoffMaxDelay: string;
    BackoffFactor: number;
    Jitter: string;
}

export interface CircuitBreakerPolicyConfig {
    FailureThresholdCount: number;
    FailureThresholdCapacity: number;
    HalfOpenAfter: string;
    SuccessThresholdCount: number;
    SuccessThresholdCapacity: number;
}

export interface TimeoutPolicyConfig {
    Duration: string;
}

export interface HedgePolicyConfig {
    Delay: string;
    MaxCount: number;
}

export interface RateLimiterConfig {
    Budgets: (RateLimitBudgetConfig | undefined)[];
}

export interface RateLimitBudgetConfig {
    Id: string;
    Rules: (RateLimitRuleConfig | undefined)[];
}

export interface RateLimitRuleConfig {
    Method: string;
    MaxCount: number;
    Period: string;
    WaitTime: string;
}

export interface HealthCheckConfig {
    ScoreMetricsWindowSize: string;
}

export interface NetworkConfig {
    Architecture: NetworkArchitecture;
    RateLimitBudget: string;
    Failsafe?: FailsafeConfig;
    Evm?: EvmNetworkConfig;
}

export interface EvmNetworkConfig {
    ChainId: number;
    FinalityDepth: number;
    BlockTrackerInterval: string;
}

export interface AuthConfig {
    Strategies: (AuthStrategyConfig | undefined)[];
}

export type AuthType = string;

export interface AuthStrategyConfig {
    IgnoreMethods: string[];
    AllowMethods: string[];
    RateLimitBudget: string;
    Type: AuthType;
    Network?: NetworkStrategyConfig;
    Secret?: SecretStrategyConfig;
    Jwt?: JwtStrategyConfig;
    Siwe?: SiweStrategyConfig;
}

export interface SecretStrategyConfig {
    Value: string;
}

export interface JwtStrategyConfig {
    AllowedIssuers: string[];
    AllowedAudiences: string[];
    AllowedAlgorithms: string[];
    RequiredClaims: string[];
    VerificationKeys: { [key: string]: string };
}

export interface SiweStrategyConfig {
    AllowedDomains: string[];
}

export interface NetworkStrategyConfig {
    AllowedIPs: string[];
    AllowedCIDRs: string[];
    AllowLocalhost: boolean;
    TrustedProxies: string[];
}

export interface MetricsConfig {
    Enabled: boolean;
    Host: string;
    Port: number;
}

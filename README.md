# eRPC Config Builder

A TypeScript-based configuration builder for [eRPC](https://github.com/erpc/erpc), the RPC load balancer for blockchain.

## 🚧 Work in Progress

This project is currently under active development. Features and API may change.

## Features

- [x] TypeScript types for eRPC config
- [x] Write YAML config file for eRPC config
- [x] Helpers for networks, upstream, and auth configurations
- [x] Support for various blockchain networks and RPC providers
- [ ] Cleaner rate limit configuration and auto completion
- [ ] Builder pattern with chaining (like `createProject(...).addRateLimits(...)/* a few more steps */.write(...)`)

## Installation

```bash
bun add @konfeature/erpc-config-builder
```

## Usage

Here's a basic overview of how to use the eRPC Config Builder:

```typescript
import {
  writeErpcConfig,
  buildEvmNetworks,
  buildRateLimit,
  buildAlchemyUpstream,
  buildProject,
  envVariable,
  type Config
} from '@konfeature/erpc-config-builder';

// Build rate limits
const rateLimits = buildRateLimit({
  id: "alchemy-rate-limit",
  rules: [{ method: "*", maxCount: 200, period: "1s" }],
});

// Build networks
const networks = buildEvmNetworks({
  chains: [arbitrum, optimism],
  generic: {
    // Generic network configuration
  },
  networks: {
    // Specific network configurations
  }
});

// Build upstreams
const upstreams = [
  buildAlchemyUpstream({
    apiKey: envVariable("ALCHEMY_API_KEY"),
    rateLimitBudget: rateLimits.id,
  }),
];

// Build projects
const project = buildProject({
  id: "my-project",
  networks,
  upstreams,
  // Other project configuration
});

// Create main config
const config: Config = {
  logLevel: envVariable("ERPC_LOG_LEVEL"),
  projects: [project],
  rateLimiters: { budgets: [rateLimits] },
  // Other configuration options
};

// Write config to YAML file
writeErpcConfig({ config, outputPath: "erpc-config.yaml" });
```

## API Overview

### Config Writing

- `writeErpcConfig({ config, outputPath })`: Write the complete eRPC configuration to a YAML file.

### Environment Variables

- `envVariable(name: string)`: Helper function to reference environment variables in the config.

### Rate Limits

- `buildRateLimit<TRpc extends RpcSchema = EIP1474Methods>({ id, rules })`: Create a rate limit configuration with customizable RPC schema, for type completion.

### Networks

- `buildEvmNetworks<TChains extends readonly [Chain, ...Chain[]]>({ chains, generic, networks })`: Build configurations for EVM-compatible networks, supporting custom chain configurations.

### Upstreams

- `buildEnvioUpstream(options?)`: Configure Envio as an upstream provider.
- `buildAlchemyUpstream({ apiKey, ...options })`: Configure Alchemy as an upstream provider.
- `buildPimlicoUpstream({ apiKey, ...options })`: Configure Pimlico as an upstream provider.
- `buildEvmUpstream<TRpc extends RpcSchema>({ id, endpoint, ...options })`: Configure a generic EVM upstream provider with customizable RPC schema.

### Projects

- `buildProject(projectConfig)`: Create a project configuration.

### Authentication

- `buildNetworkAuthStrategy<TRpc extends RpcSchema>({ network, ...baseOptions })`: Configure network-based authentication.
- `buildSecretAuthStrategy<TRpc extends RpcSchema>({ secret, ...baseOptions })`: Configure secret-based authentication.
- `buildJwtAuthStrategy<TRpc extends RpcSchema>({ jwt, ...baseOptions })`: Configure JWT-based authentication.
- `buildSiweAuthStrategy<TRpc extends RpcSchema>({ siwe, ...baseOptions })`: Configure Sign-In with Ethereum authentication.

### Types

The library exports two custom utility types:

- `RpcMethodWithRegex<TRpc>`: Represents RPC methods, including support for wildcard patterns.
- `OptionalRateLimit<T>`: Makes the `rateLimitBudget` field optional in a type that includes it.

All other exported types (such as `Config`, `ServerConfig`, `DatabaseConfig`, etc.) are TypeScript representations of the original eRPC Go config type definitions. These provide strong typing for configuration objects and can be imported and used in your TypeScript projects.

For a complete list of available types, refer to the type definitions in the library.

## Usage examples

For a simple setup, please refer to the [simple example](example/simple.ts) in the repository.

For more detailed examples and advanced usage, please refer to the [frak example](example/frak.ts) in the repository.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgements

This project is built to work with [eRPC](https://github.com/erpc/erpc), an excellent RPC load balancer for blockchain written in Go.

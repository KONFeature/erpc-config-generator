# eRPC Config Builder

A TypeScript-based configuration builder for [eRPC](https://github.com/erpc/erpc), the RPC load balancer for blockchain.

## 🚧 Work in Progress

This project is currently under active development. Features and API may change.

## Features

- [x] TypeScript types for eRPC config
- [x] Write YAML config file for eRPC config
- [x] Helpers for networks, upstream, and auth configurations
- [x] Support for various blockchain networks and RPC providers
- [ ] More stuff within the CLI (config validity check, docker file generation, version specification etc)
- [ ] Cleaner rate limit configuration and auto completion
- [ ] Builder pattern with chaining (like `createProject(...).addRateLimits(...)/* a few more steps */.write(...)`)

## Installation

```bash
bun add @konfeature/erpc-config-generator
```

## Usage

1. Create a TypeScript file (e.g., `erpc-config.ts`) that exports a full `Config` object as default:

```typescript
import { Config, buildEvmNetworks, buildRateLimit, buildAlchemyUpstream, buildProject, envVariable } from '@konfeature/erpc-config-generator';

// ... (configuration setup)

const config: Config = {
  // Your eRPC configuration
};

export default config;
```

2. Run the CLI command to generate the YAML configuration:

```bash
bunx erpc-config
```

This will read the `erpc-config.ts` file in the current directory and output the configuration to `erpc.yaml`.

## CLI Usage

The `erpc-config` command supports the following options:

```
erpc-config [options]

Options:
  --config    The path to the config file (default: "./erpc-config.ts")
  --out       The output file path (default: "./erpc.yaml")
```

Examples:

```bash
# Use default paths
npx erpc-config

# Specify custom input and output paths
npx erpc-config --config ./configs/my-erpc-config.ts --out ./configs/my-erpc-config.yaml
```

## API Overview

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

## Real-World Usage

For a comprehensive, real-world example of how to use the eRPC Config Generator, you can refer to the Frak indexer repository:

[Frak Indexer eRPC Configuration](https://github.com/frak-id/frak-indexer/tree/main/packages/erpc)

This demonstrates:

1. How to structure your eRPC configuration in a TypeScript project
2. Setting up multiple networks and upstreams
3. Configuring rate limits and authentication strategies
4. Using environment variables for sensitive information

The entire configuration is contained in a single file:

- `erpc-config.ts`: The main configuration file that exports the complete eRPC config

To generate the YAML configuration from this setup, the project uses:

```bash
pnpm erpc-config
```

The resulting YAML configuration is output to:

- `erpc.yaml`: The generated eRPC configuration file

This example showcases how to integrate the eRPC Config Generator into a larger project, using pnpm as the package manager. It's a great reference for structuring your own eRPC configuration in a production environment.

You can use this as a template for your own project, adjusting the network configurations, upstreams, and other settings as needed for your specific use case.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgements

This project is built to work with [eRPC](https://github.com/erpc/erpc), an excellent RPC load balancer for blockchain written in Go.

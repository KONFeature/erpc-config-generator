# eRPC Config Builder

A TypeScript-based configuration builder for [eRPC](https://github.com/erpc/erpc), the RPC load balancer for blockchain.

> ⚠️ **Deprecation**: This project is slowly being moved directly inside [eRPC](https://github.com/erpc/erpc).
>  [ERPC config package](https://www.npmjs.com/package/@erpc-cloud/config)

- [x] Simple typescript config
- [ ] https://github.com/erpc/erpc/pull/106 (Typescript chained builder pattern + strong types)
- [ ] OxLib support for strongly typed rpc methods / evm related stuff
- [ ] Helpers implementation (networks, upstreams, auth, caching, failsafe, etc)
- [ ] And much more to come 👀

## 🚧 Work in Progress

This project is currently under active development. Features and API may change.

## Features

- [x] TypeScript types for eRPC config
- [x] Write YAML config file for eRPC config
- [x] Helpers for networks, upstream, and auth configurations
- [x] Support for various blockchain networks and RPC providers
- [x] Automatic generation of free RPC upstreams using `evm+free` type
- [x] Command to fetch best free RPC URLs for a given chain
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

The eRPC Config Generator CLI provides two main commands: `generate` (default) and `validate`.

### Generate Command

Generate an eRPC YAML config file from the TypeScript config:

```
erpc-config [options]
```
or
```
erpc-config generate [options]
```

Options:
  --config    The path to the config file (default: "./erpc-config.ts")
  --out       The output file path (default: "./erpc.yaml")

Examples:

```bash
# Use default paths
bun erpc-config

# Specify custom input and output paths
bun erpc-config --config ./configs/my-erpc-config.ts --out ./configs/my-erpc-config.yaml

# Explicitly use the generate command
bun erpc-config generate --config ./custom-config.ts
```
Note: When using `evm+free` upstream type, the generator will automatically fetch and include the 15 best free RPC URLs for the specified chain in the output YAML.

### Validate Command

Check the validity of the eRPC config file:

```
erpc-config validate [options]
```

Options:
  --config    The path to the config file to validate (default: "./erpc-config.ts")

Example:

```bash
# Validate the default config file
bun erpc-config validate

# Validate a specific config file
bun erpc-config validate --config ./configs/my-erpc-config.ts
```

### Free RPC Command

Fetch the 15 best free RPC URLs for a given chain:

```
erpc-config free-rpc --chain-id <chainId>
```

Options:
  --chain-id    The chain ID to fetch free RPC URLs for (required)

Example:

```bash
# Fetch free RPC URLs for Ethereum mainnet (chain ID 1)
bun erpc-config free-rpc --chain-id 1
```

### General CLI Options

- `--help`, `-h`: Show help information
- `--version`, `-v`: Show version information

You can run these commands using `bun`, `npm`, or any other package runner of your choice, as long as you have the dependency in your `packages.json`.

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
- `buildFreeUpstreams({ chains, ...options})`: Configure placeholder upstreams that will be filled with the 15 best free RPCs for the specified chain.

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

## Dependencies

This package relies on the following main dependencies:

- [viem](https://viem.sh/): (Peer Dependency) A TypeScript interface for Ethereum, providing lightweight and type-safe modules for interacting with the blockchain.

- [@ubiquity-dao/rpc-handler](https://github.com/ubiquity/rpc-handler): (Optional Peer Dependency) Used for fetching and comparing free RPC URLs from chainlist. Only required if you intend to use the free RPC features.

- [erpc](https://www.erpc.cloud/): The core RPC load balancer that this config generator is designed for. It offers fault-tolerant EVM RPC load balancing with reorg-aware permanent caching and auto-discovery of node providers.

- [gluegun](https://github.com/infinitered/gluegun): A toolkit used for building the command-line interface of this config generator, offering a robust set of utilities for creating TypeScript-powered CLI apps.

Please ensure you have the required peer dependencies installed in your project when using this package. The `@ubiquity-dao/rpc-handler` is only necessary if you plan to utilize the free RPC functionality.

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

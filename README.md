# eRPC Config Builder

A TypeScript-based configuration builder for [eRPC](https://github.com/erpc/erpc), the RPC load balancer for blockchain.

It now used the exported [`@erpc-cloud/config`](https://github.com/erpc/erpc) package from eRPC for all the types.

This package add the builder pattern and provide a more type safe way to create your configuration, with a few static cli helpers.


## 🚧 Work in Progress

This project is currently under active development. Features and API may change.

## Features

- [x] Builder pattern with type safe rate limits
- [x] Helpers for networks, upstream
- [x] Support for various blockchain networks and RPC providers
- [x] Command to fetch best free RPC URLs for a given chain
- [x] CLI with pre validation + bundling command
- [x] Matcher pattern for rpc methods
- [ ] Automatic generation of free RPC upstreams using `evm+free` type
- [ ] More stuff within the CLI (docker file generation, initial config file, cli config updates)
- [ ] And much more to come 👀

## Installation

```bash
bun add @konfeature/erpc-config-generator @erpc-cloud/config
```

## Usage

1. Create a TypeScript file (e.g., `erpc-config.ts`) that exports a full `Config` object as default:

```typescript
import { initErpcConfig } from "@konfeature/erpc-config-generator";

export default initErpcConfig({
  logLevel: "info",
})
  .addRateLimiters({
    // Rate limiter budget for the porject
    projectBudget: [
      {
        method: "*",
        period: "1s",
        waitTime: "1m",
        maxCount: 1000,
      },
    ],
    // Rate limiter for the upstream
    upstreamBudget: [
      {
        method: "*",
        period: "1s",
        waitTime: "1m",
        maxCount: 1000,
      },
    ],
  })
  .addProject({
    // Project with one upstream
    id: "main-project",
    upstreams: [
      {
        id: "upstream-1",
        endpoint: "http://localhost:3000",
        rateLimitBudget: "upstreamBudget",
      },
    ],
    rateLimitBudget: "projectBudget",
  })
  .build()
```

> Note the `.build()` at the end, it's mandatory for it to export nicely and be recognized by the CLI.

2. Run the CLI command to generate the bundled JS configuration:

```bash
bunx erpc-config
```

This will read the `erpc-config.ts` file in the current directory and output the configuration to `erpc.js`.

> **Note:** You can bundle the configuration with the bundler of your choice (bun build, esbuild, terser, etc.)

## CLI Usage

The eRPC Config Generator CLI provides two main commands: `generate` (default) and `validate`.

### Package Command

Package an eRPC JS config file from the TypeScript config:

```
erpc-config [options]
```
or
```
erpc-config package [options]
```

Options:
  --config    The path to the config file (default: "./erpc-config.ts")
  --out       The output file path (default: "./erpc.js")

Examples:

```bash
# Use default paths
bun erpc-config

# Specify custom input and output paths
bun erpc-config --config ./configs/my-erpc-config.ts --out ./configs/my-erpc-config.js

# Explicitly use the package command
bun erpc-config package --config ./custom-config.ts
```

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

### General CLI Options

- `--help`, `-h`: Show help information
- `--version`, `-v`: Show version information

You can run these commands using `bun`, `npm`, or any other package runner of your choice, as long as you have the dependency in your `packages.json`.

## API Overview

### Builder Methods

- **`initErpcConfig(config: InitConfig)`**: Initializes the configuration with basic settings such as `logLevel` and `server` properties.

- **`addRateLimiters(budgets: Record\<TKeys,RateLimitRuleConfig[]>)`**: Adds rate limiters to your configuration.

- **`decorate(scope: "upstreams" | "networks", value: Record\<TStoreKey, NetworkConfig | UpstreamConfig>)`**: Adds values to the store for `networks` or `upstreams`.

  - **Scope**: Determines which store (`networks` or `upstreams`) to push values to.
  - **Value**: The static values to add the the builder store

- **`addProject(project: ProjectConfig | ({config: Config, store: Store} => ProjectConfig))`**: Adds a project to your configuration.

### Networks

- `buildEvmNetworks<TChains extends readonly [Chain, ...Chain[]]>({ chains, generic, networks })`: Build configurations for EVM-compatible networks, supporting custom chain configurations.

### Upstreams

- `buildEnvioUpstream(options?)`: Configure Envio as an upstream provider.
- `buildAlchemyUpstream({ apiKey, ...options })`: Configure Alchemy as an upstream provider.
- `buildPimlicoUpstream({ apiKey, ...options })`: Configure Pimlico as an upstream provider.
- `buildEvmUpstream<TRpc extends RpcSchema>({ id, endpoint, ...options })`: Configure a generic EVM upstream provider with customizable RPC schema.
- `buildFreeUpstreams({ chains, ...options})`: Configure placeholder upstreams that will be filled with the 15 best free RPCs for the specified chain.

## Dependencies

This package relies on the following main dependencies:

- [viem](https://viem.sh/): (Peer Dependency) A TypeScript interface for Ethereum, providing lightweight and type-safe modules for interacting with the blockchain.

- [erpc](https://www.erpc.cloud/): The core RPC load balancer that this config generator is designed for. It offers fault-tolerant EVM RPC load balancing with reorg-aware permanent caching and auto-discovery of node providers.

- [gluegun](https://github.com/infinitered/gluegun): A toolkit used for building the command-line interface of this config generator, offering a robust set of utilities for creating TypeScript-powered CLI apps.

## Usage examples

For a simple setup, please refer to the [simple example](example/simple.ts) in the repository.

You can check a more [complete example here](/typescript/config/example/full.ts).

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

To generate the JS configuration from this setup, the project uses:

```bash
bun erpc-config
```

The resulting JS configuration is output to:

- `erpc.js`: The generated eRPC configuration file

This example showcases how to integrate the eRPC Config Generator into a larger project, using bun as the package manager. It's a great reference for structuring your own eRPC configuration in a production environment.

You can use this as a template for your own project, adjusting the network configurations, upstreams, and other settings as needed for your specific use case.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgements

This project is built to work with [eRPC](https://github.com/erpc/erpc), an excellent RPC load balancer for blockchain written in Go.

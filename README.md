# eRPC Config Builder

A TypeScript-based configuration builder for [eRPC](https://github.com/erpc/erpc), the RPC load balancer for blockchain.

## 🚧 Work in Progress

This project is currently under active development. Features and API may change.

## Features

- [x] TypeScript types for eRPC config
- [x] Write YAML config file for eRPC config
- [ ] Viem support to ease with chain and network configurations
- [ ] Helpers for networks, upstream, and auth configurations

## Overview

This library aims to simplify the process of creating and managing eRPC configurations by providing a TypeScript-based builder pattern. It allows you to programmatically create eRPC configs with type safety and output them as YAML files.

## Installation

```bash
bun add erpc-config-builder
```

## Usage

For a detailed example of how to use this library, please refer to our [simple example](example/simple.ts) in the repository.

This example demonstrates:

1. How to create individual components like rate limit budgets, upstreams, and network configurations
2. How to combine these components into a complete eRPC configuration
3. How to use the `createErpcConfig` function to output the configuration as a YAML file

You can use this example as a starting point for creating your own eRPC configurations.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgements

This project is built to work with [eRPC](https://github.com/erpc/erpc), an excellent RPC load balancer for blockchain written in Go.

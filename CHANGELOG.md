# erpc-config-generator

## 0.1.2

### Patch Changes

- [`14f858e`](https://github.com/KONFeature/erpc-config-generator/commit/14f858e645d7b0b44fc4bbfd2734284aecfecf9a) Thanks [@KONFeature](https://github.com/KONFeature)! - Upgrade to @erpc-cloud/config v0.0.39

## 0.1.1

### Patch Changes

- [`5ded23b`](https://github.com/KONFeature/erpc-config-generator/commit/5ded23b52880dc6308d2ed870dea55a2f9780cae) Thanks [@KONFeature](https://github.com/KONFeature)! - Upgrade to @erpc-cloud/config v0.0.36 (supporting providers, proxy pools etc) + add providers in thebuilder store (so available with `decorate` method)`

## 0.1.0

### Minor Changes

- [`b334abc`](https://github.com/KONFeature/erpc-config-generator/commit/b334abc4904ff0ef2248a52f44a087fbec4992bb) Thanks [@KONFeature](https://github.com/KONFeature)! - - Introduce the builder pattern using `initErpcConfig`
  - Remove auto generated type and move to the exported type of `@erpc-cloud/config`
  - Review upstreams builder helpers for a wider support of the matching pattern
  - Remove YAML file generation, since erpc now support js/ts config file
  - Remove free rpc benchmark for now, currently envisaging multiple way to re-introduce it later, maybe using dynamic config or the selection eval policy?

## 0.0.13

### Patch Changes

- [`99667a9`](https://github.com/KONFeature/erpc-config-generator/commit/99667a9f55be2c77113c5a16d555ff3319cebe70) Thanks [@KONFeature](https://github.com/KONFeature)! - Update erpc types for erpc `v0.0.27`

## 0.0.12

### Patch Changes

- [`576e301`](https://github.com/KONFeature/erpc-config-generator/commit/576e3016e572f558f51db8718bfee2eef11c9360) Thanks [@KONFeature](https://github.com/KONFeature)! - More options for the free rpc benchmark during config, via the `freeRpcBenchmarkConfig` function

- [`c154540`](https://github.com/KONFeature/erpc-config-generator/commit/c1545404f840a3a56bff7ff7cb7bba40bdfbb74a) Thanks [@KONFeature](https://github.com/KONFeature)! - Add multi run support for free rpc benchmarking

## 0.0.11

### Patch Changes

- [`91bb796`](https://github.com/KONFeature/erpc-config-generator/commit/91bb7965c85f927a168f61306b070392534a08c0) Thanks [@KONFeature](https://github.com/KONFeature)! - Update generated free upstream id to the format: `free-{rpcHostname}-{chainId}-{uuid}`

- [`91bb796`](https://github.com/KONFeature/erpc-config-generator/commit/91bb7965c85f927a168f61306b070392534a08c0) Thanks [@KONFeature](https://github.com/KONFeature)! - Export `buildFreeUpstreams` builder

## 0.0.10

### Patch Changes

- [`0052307`](https://github.com/KONFeature/erpc-config-generator/commit/00523074072eb5b0f790a1bd774692b6c99d6ef5) Thanks [@KONFeature](https://github.com/KONFeature)! - Add a new `evm+free` type of upstream (alongside the `buildFreeUpstreams(...)` helper) to generate placeholder upstreams that will be filled with the 15 best free rpcs

- [`0052307`](https://github.com/KONFeature/erpc-config-generator/commit/00523074072eb5b0f790a1bd774692b6c99d6ef5) Thanks [@KONFeature](https://github.com/KONFeature)! - Add a new `free-rpc` command to get the 15 best free rpc url for a given chain

## 0.0.9

### Patch Changes

- [`4ee4e6f`](https://github.com/KONFeature/erpc-config-generator/commit/4ee4e6fb605e6716d6192f397f6e6d6f35cb8513) Thanks [@KONFeature](https://github.com/KONFeature)! - Update erpc types for erpc `v0.0.19`

## 0.0.8

### Patch Changes

- [`756d261`](https://github.com/KONFeature/erpc-config-generator/commit/756d261e5dd79e78962b3ac894b05b26fa13f5c7) Thanks [@KONFeature](https://github.com/KONFeature)! - Optional `server` and `metrics` field in the root config object + generation info

- [`756d261`](https://github.com/KONFeature/erpc-config-generator/commit/756d261e5dd79e78962b3ac894b05b26fa13f5c7) Thanks [@KONFeature](https://github.com/KONFeature)! - Update erpc types for erpc `v0.0.18`

## 0.0.7

### Patch Changes

- [`d33d8e7`](https://github.com/KONFeature/erpc-config-generator/commit/d33d8e7747014db2303b00012a92f41b158c7d80) Thanks [@KONFeature](https://github.com/KONFeature)! - Update erpc types for version `0.0.15`

- [`9628c51`](https://github.com/KONFeature/erpc-config-generator/commit/9628c51fc15c434e266bbfa5ffa9ab851400fa08) Thanks [@KONFeature](https://github.com/KONFeature)! - Update eRPC types for `latest` version

## 0.0.6

### Patch Changes

- [`718a691`](https://github.com/KONFeature/erpc-config-generator/commit/718a691bec9d50e80bc02e0faea05a9c971e27e9) Thanks [@KONFeature](https://github.com/KONFeature)! - Update default network value `finalityDepth` from 128 to 1024

- [`d05c382`](https://github.com/KONFeature/erpc-config-generator/commit/d05c38206bc299364aa0b1a01f93a43447878f56) Thanks [@KONFeature](https://github.com/KONFeature)! - Add `validate` command + some validation step before config file generation

## 0.0.5

### Patch Changes

- [`d4d89a5`](https://github.com/KONFeature/erpc-config-generator/commit/d4d89a5f63c19a50d1b20d2cc67274ba3ddb2b78) Thanks [@KONFeature](https://github.com/KONFeature)! - Fix bin path for the cli

## 0.0.4

### Patch Changes

- [`a3ca9c7`](https://github.com/KONFeature/erpc-config-generator/commit/a3ca9c7739b3d64c048dc0dde99c185f643e029b) Thanks [@KONFeature](https://github.com/KONFeature)! - Setup a simple CLI to ease the generation using the `generate` command (and passing config typescript file and output yml file)

## 0.0.3

### Patch Changes

- Cleaner `writeConfig` options

## 0.0.2

### Patch Changes

- Initial version

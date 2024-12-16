---
"@konfeature/erpc-config-generator": minor
---

- Introduce the builder pattern using `initErpcConfig`
- Remove auto generated type and move to the exported type of `@erpc-cloud/config`
- Review upstreams builder helpers for a wider support of the matching pattern
- Remove YAML file generation, since erpc now support js/ts config file
- Remove free rpc benchmark for now, currently envisaging multiple way to re-introduce it later, maybe using dynamic config or the selection eval policy?

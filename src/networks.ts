import type { Chain } from "viem";
import type { NetworkConfig } from "./generatedTypes/erpcTypes";

/**
 * Build a list of networks
 * @param `chains` List of EVM chain for which we want to add the network
 * @param `generic` Some generic config for each network
 * @param `networks` Some per network specific config (ie custom rate limit budget or stuff like that)
 */
export function getEvmNetworks<
    TChains extends readonly [Chain, ...Chain[]] = readonly [Chain, ...Chain[]],
>({
    chains,
    generic = {},
    networks = {},
}: {
    chains: TChains;
    generic?: Partial<NetworkConfig>;
    networks?: Record<number, Partial<NetworkConfig>>;
}) {
    // Build each networks config
    return chains.map((chain) => {
        // Rebuild full options for this network
        const options = {
            // First generic options
            ...generic,
            // Then overide with network one if found
            ...networks[chain.id],
        };

        // Get the rate limit budget
        const rateLimitBudget = options?.rateLimitBudget ?? "";

        // Build the network confg
        return {
            ...options,
            architecture: "evm",
            rateLimitBudget: rateLimitBudget,
            evm: {
                chainId: chain.id,
                finalityDepth: options.evm?.finalityDepth ?? 128,
                blockTrackerInterval: options?.evm?.blockTrackerInterval ?? "",
            },
        };
    });
}

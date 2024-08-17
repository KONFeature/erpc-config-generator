import type { Chain } from "viem";
import type {
    EvmNetworkConfig,
    NetworkConfig,
} from "./generatedTypes/erpcTypes";

/**
 * Partial EVM network config, without chainId (since it will came from the viem chain)
 */
type PartialEvmConfig = Partial<Omit<EvmNetworkConfig, "chainId">>;

/**
 * Partial network config, with the custom evm options
 */
type PartialNetworkConfig = Partial<Omit<NetworkConfig, "evm">> & {
    evm?: PartialEvmConfig;
};

/**
 * Build a list of networks
 * @param `chains` List of EVM chain for which we want to add the network
 * @param `generic` Some generic config for each network
 * @param `networks` Some per network specific config (ie custom rate limit budget or stuff like that)
 *
 * @default The default rate limit budget is empty
 * @default The default block tracker interval is empty
 * @default The default finality depth is 128
 */
export function buildEvmNetworks<
    TChains extends readonly [Chain, ...Chain[]] = readonly [Chain, ...Chain[]],
>({
    chains,
    generic = {},
    networks = {},
}: {
    chains: TChains;
    generic?: PartialNetworkConfig;
    networks?: Partial<Record<TChains[number]["id"], PartialNetworkConfig>>;
}) {
    // Build each networks config
    return chains.map((chain) => {
        // Rebuild full options for this network
        const options = {
            // First generic options
            ...generic,
            // Then overide with network one if found
            ...networks[chain.id as TChains[number]["id"]],
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

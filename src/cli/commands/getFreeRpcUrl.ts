import type { GluegunToolbox } from "gluegun";
import { getFreeRpcUrlsForChain } from "../utils/upstream";

/**
 * The command to generate the eRPC config
 */
export async function getFreeRpcUrls({ print, parameters }: GluegunToolbox) {
    // Extract the arguments
    const chainId = parameters.options.chainId;
    if (typeof chainId !== "number") {
        throw new Error("Invalid chain id");
    }

    print.info(`Fetching free rpcs for chain ${chainId}`);

    // Find the best rpcs
    const rpcs = await getFreeRpcUrlsForChain({ chainId: chainId });

    // Log the rpcs
    print.newline();
    print.info("Free RPCs:");
    for (const rpc of rpcs) {
        print.info(` - ${rpc}`);
    }
}

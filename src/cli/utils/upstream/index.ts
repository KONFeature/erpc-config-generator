import { print } from "gluegun";
import { toHex } from "viem";
import type {
    Config,
    ProjectConfig,
    UpstreamConfig,
} from "../../../generatedTypes/erpcTypes";
import { getFreeRpcUrlsForChain } from "./freeRpc";

export { getFreeRpcUrlsForChain } from "./freeRpc";

/**
 * Populate the config with the free rpcs where they are wanted
 *  - todo: deduplicate the logic per chain if multiple projects are using the same chain
 */
export async function populateFreeRpcConfig({
    config,
}: { config: Config }): Promise<Config> {
    const projects: ProjectConfig[] = [];

    // Iterate over each projects
    for (const project of config.projects) {
        if (!project) continue;

        const newUpstreams: UpstreamConfig[] = [];

        // Iterate over each upstreams
        for (const upstream of project.upstreams) {
            if (!upstream) continue;

            // If it's not a free rpc, skip
            if (upstream.type !== "evm+free") {
                continue;
            }

            // Upstream id contain chainId: evm+free://${chain.id}
            const chainId = Number.parseInt(upstream.endpoint.split("://")[1]);
            if (Number.isNaN(chainId)) {
                print.error(
                    `Invalid chain id in upstream ${upstream.id} on project ${project.id}`
                );
                continue;
            }

            // Get the rpc urls for the chain
            const rpcUrls = await getFreeRpcUrlsForChain({ chainId });

            // Build the new upstreams based on this rpc urls
            const upstreams: UpstreamConfig[] = rpcUrls.map((url) => {
                return {
                    ...upstream,
                    vendorName: "Free RPC",
                    id: `${upstream.id}-${toHex(url)}`,
                    endpoint: url,
                    type: "evm",
                };
            });
            newUpstreams.push(...upstreams);
        }

        // Rebuild a clean upstream list
        const cleanUpstreams = project.upstreams.filter(
            (upstream) => upstream?.type !== "evm+free"
        );
        cleanUpstreams.push(...newUpstreams);

        // Rebuild a clean project
        projects.push({
            ...project,
            upstreams: newUpstreams,
        });
    }

    return { ...config, projects };
}

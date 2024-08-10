import type { PublicRpcSchema, RpcSchema } from "viem";
import type { RateLimitBudgetConfig } from "./generatedTypes/erpcTypes";

export type RpcMethod<TRpc extends RpcSchema> = TRpc[number]["Method"] | "*";

/**
 * Build a rate limit rule
 */
export function getRateLimit<TRpc extends RpcSchema = PublicRpcSchema>({
    id,
    rules,
}: {
    id: string;
    rules: {
        method: RpcMethod<TRpc>;
        maxCount: number;
        period: string;
        waitTime?: string;
    }[];
}): RateLimitBudgetConfig {
    return {
        id,
        rules: rules.map((rule) => ({
            ...rule,
            waitTime: rule.waitTime ?? "",
        })),
    };
}

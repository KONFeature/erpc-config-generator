import type { PublicRpcSchema, RpcSchema } from "viem";
import type {
    RateLimitBudgetConfig,
    RateLimitRuleConfig,
} from "./generatedTypes/erpcTypes";

export type RpcMethod<TRpc extends RpcSchema> = TRpc[number]["Method"] | "*";

type RateLimitRule<TRpc extends RpcSchema> = Omit<
    RateLimitRuleConfig,
    "waitTime" | "method"
> & {
    method: RpcMethod<TRpc>;
    waitTime?: string;
};

/**
 * Build a rate limit rule
 */
export function getRateLimit<TRpc extends RpcSchema = PublicRpcSchema>({
    id,
    rules,
}: {
    id: string;
    rules: RateLimitRule<TRpc>[];
}): RateLimitBudgetConfig {
    return {
        id,
        rules: rules.map((rule) => ({
            ...rule,
            waitTime: rule.waitTime ?? "",
        })),
    };
}

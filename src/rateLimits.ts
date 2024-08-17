import type { EIP1474Methods, RpcSchema } from "viem";
import type {
    RateLimitBudgetConfig,
    RateLimitRuleConfig,
} from "./generatedTypes/erpcTypes";
import type { RpcMethod } from "./types/rpc";

/**
 * Rate limit rule types
 */
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
export function buildRateLimit<TRpc extends RpcSchema = EIP1474Methods>({
    id,
    rules,
}: {
    id: string;
    rules: RateLimitRule<TRpc>[];
    rpcSchema?: TRpc;
}): RateLimitBudgetConfig {
    return {
        id,
        rules: rules.map((rule) => ({
            ...rule,
            waitTime: rule.waitTime ?? "",
        })),
    };
}

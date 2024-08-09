import type {
    RateLimitBudgetConfig,
    RateLimitRuleConfig,
} from "./generatedTypes/erpcTypes";

type RuleWithOptionalWaitTime = Omit<RateLimitRuleConfig, "waitTime"> & {
    waitTime?: string;
};

/**
 * Build a rate limit rule
 */
export function getRateLimit(
    args: Omit<RateLimitBudgetConfig, "rules"> & {
        rules: RuleWithOptionalWaitTime[];
    }
): RateLimitBudgetConfig {
    return {
        ...args,
        rules: args.rules.map((rule) => ({
            ...rule,
            waitTime: rule.waitTime ?? "",
        })),
    };
}

/**
 * Optional field from a type.
 */
export type OptionalField<T, K extends keyof T> = Omit<T, K> &
    Pick<Partial<T>, K>;

/**
 * Type with an optional rate limit budget field.
 */
export type OptionalRateLimit<T extends { rateLimitBudget: string }> =
    OptionalField<T, "rateLimitBudget">;

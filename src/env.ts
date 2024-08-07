/**
 * Simple placeholder for env variable
 * @param envName
 * @returns
 */
export function envVariable(envName: string): string {
    return `\${${envName}}`;
}

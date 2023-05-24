export namespace OpenAiConfiguration {
  export const DEFAULT_CONFIGURATION: OpenAiConfiguration = {
    apiKey: undefined,
    organizationId: undefined,
  };
}
/**
 * Configuration for the OpenAI API.
 */
export interface OpenAiConfiguration {
  apiKey: string | undefined;

  organizationId: string | undefined;
}

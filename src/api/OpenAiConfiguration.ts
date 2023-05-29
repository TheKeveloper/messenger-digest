export namespace OpenAiConfiguration {
  export const DEFAULT_CONFIGURATION: OpenAiConfiguration = {};
}
/**
 * Configuration for the OpenAI API.
 */
export interface OpenAiConfiguration {
  apiKey?: string;

  organizationId?: string;
}

import { OpenAiConfiguration } from "../api/OpenAiConfiguration";

const OPEN_AI_CONFIGURATION = "OPEN_AI_CONFIGURATION";

export async function loadOpenAiConfiguration(): Promise<OpenAiConfiguration> {
  let result = await chrome.storage.local.get({
    [OPEN_AI_CONFIGURATION]: OpenAiConfiguration.DEFAULT_CONFIGURATION,
  });
  return result[OPEN_AI_CONFIGURATION];
}

export async function saveOpenAiConfiguration(
  configuration: OpenAiConfiguration
) {
  return await chrome.storage.local.set({
    [OPEN_AI_CONFIGURATION]: configuration,
  });
}

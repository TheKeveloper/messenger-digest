import { OpenAiConfiguration } from "../api/OpenAiConfiguration";

const OPEN_AI_CONFIGURATION = "OPEN_AI_CONFIGURATION";
export async function getOpenAiConfiguration(): Promise<OpenAiConfiguration> {
  return (
    ((await chrome.storage.sync.get(
      OPEN_AI_CONFIGURATION
    )) as OpenAiConfiguration) ?? {}
  );
}

export function saveOpenAiConfiguration(configuration: OpenAiConfiguration) {
  chrome.storage.sync.set({
    [OPEN_AI_CONFIGURATION]: configuration,
  });
}

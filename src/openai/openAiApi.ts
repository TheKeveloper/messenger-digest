import { Configuration, OpenAIApi } from "openai";
import { OpenAiConfiguration } from "../api/OpenAiConfiguration";

export function getOpenAiApi({
  apiKey,
  organizationId,
}: OpenAiConfiguration): OpenAIApi {
  const configuration = new Configuration({
    apiKey,
    organization: organizationId,
  });

  return new OpenAIApi(configuration);
}

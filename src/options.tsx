import React, { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { OpenAiConfiguration } from "./api/OpenAiConfiguration";
import { loadOpenAiConfiguration, saveOpenAiConfiguration } from "./storage/storage";
import { LoadingState } from "./api/loading";
import { trimToUndefined } from "./utils/stringUtils";
import { Button, Container, TextField } from "@mui/material";

const Options = () => {
  const [openAiConfig, setOpenAiConfig] = useState<LoadingState<OpenAiConfiguration>>(LoadingState.loading());

  useEffect(() => {
    loadOpenAiConfiguration().then(LoadingState.loaded).catch(error => {
      console.error("Error loading configuration", error);
      return LoadingState.failed(error);
    }).then(setOpenAiConfig)
  }, []);

  const onSave = useCallback(async () => {
    const curConfig = LoadingState.getLoaded(openAiConfig) ?? {};
    try {
      console.info("Before save");
      await saveOpenAiConfiguration(curConfig);
      console.info("Saved: ", curConfig);
    } catch (e) {
      console.warn("Failed to save to local storage", e);
    }
  }, [openAiConfig]);

  const onApiKeyChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const prevConfig = LoadingState.getLoaded(openAiConfig) ?? {};
    setOpenAiConfig(LoadingState.loaded({...prevConfig, apiKey: trimToUndefined(event.target.value)}));
  }, [openAiConfig, setOpenAiConfig]);

  const onOrganizationIdChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const prevConfig = LoadingState.getLoaded(openAiConfig) ?? {};
    setOpenAiConfig(LoadingState.loaded({...prevConfig, organizationId: trimToUndefined(event.target.value)}));
  }, [openAiConfig, setOpenAiConfig]);

  if (openAiConfig.status === "loading" || openAiConfig.status === "reloading") {
    return <div>Loading...</div>;
  }

  if (openAiConfig.status === "failed") {
    return <div>Failed to load data from chrome storage</div>;
  }



  return (
    <Container>
      <TextField id = "api-key-input" label="API Key" value={openAiConfig.value.apiKey} onChange={onApiKeyChange}/>
      <TextField id = "organization-id-input" label="Organization ID (optional)" value={openAiConfig.value.organizationId} onChange={onOrganizationIdChange}/>

      <Button variant="contained" onClick={onSave}>Save</Button>
    </Container>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);

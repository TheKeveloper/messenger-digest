import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { OpenAiConfiguration } from "./api/OpenAiConfiguration";
import { ChatMessage, sendRequestCurrentTab } from "./api/api";
import { LoadingState } from "./api/loading";
import { getOpenAiApi } from "./openai/openAiApi";
import { loadOpenAiConfiguration } from "./storage/storage";

const Popup = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [summary, setSummary] = useState<string>("Chat message summary");

  const [openAiConfig, setOpenAiConfig] = useState<
    LoadingState<OpenAiConfiguration>
  >(LoadingState.loading());

  useEffect(() => {
    loadOpenAiConfiguration()
      .then(LoadingState.loaded)
      .catch((error) => {
        console.error("Error loading configuration", error);
        return LoadingState.failed(error);
      })
      .then(setOpenAiConfig);
  }, []);

  const openAiConfigLoaded = LoadingState.getLoaded(openAiConfig);

  const openAiApi = useMemo(
    () =>
      openAiConfigLoaded != null ? getOpenAiApi(openAiConfigLoaded) : undefined,
    [openAiConfigLoaded]
  );

  const requestMessages = useCallback(async () => {
    try {
      const response = await sendRequestCurrentTab({ type: "messages" });
      if (response != null && response.type === "messages") {
        setMessages(response.messages);
      }
    } catch (err) {
      console.error("Error requesting messages", err);
    }
  }, [setMessages]);

  const summarizeMessages = useCallback(async () => {
    if (openAiApi != null) {
      const prompt =
        `Summarize the following messages for me: \n` +
        messages.map((message) => message.text).join("\n");

      console.log();

      try {
        const response = await openAiApi.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 300,
        });
        setSummary(
          response.data.choices[0].message?.content ?? "No summary received"
        );
      } catch (e) {
        setSummary(
          "ChatGPT failed to summarize messages, see console logs for details"
        );
        console.warn("Failed to query chatgpt api", e);
      }
    }
  }, [openAiApi, messages]);

  return (
    <Container style={{ minWidth: "350px" }}>
      <Box>
        <Button onClick={requestMessages}>Load messages</Button>
        <Button
          disabled={openAiApi == null || messages.length === 0}
          onClick={summarizeMessages}
        >
          Summarize messages
        </Button>
      </Box>

      <Box>
        {summary != null && (
          <Paper
            style={{
              maxHeight: "300px",
              overflow: "auto",
              fontSize: "14pt",
              width: "100%",
            }}
          >
            {summary}
          </Paper>
        )}
      </Box>

      <List style={{ maxHeight: "200px", overflow: "auto" }}>
        {messages.map((message) => (
          <ListItem style={{ border: 1 }}>
            <ListItemText>{message.text}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);

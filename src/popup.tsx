import React, { useCallback, useState } from "react";
import { createRoot } from "react-dom/client";
import { ChatMessage, sendRequestCurrentTab } from "./api/api";
import { Button, Container, List, ListItem, ListItemText } from "@mui/material";

const Popup = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const requestMessages = useCallback(async () => {
    try {
      const response = await sendRequestCurrentTab({ type: "messages" });
      if (response != null && response.type === "messages"){
        setMessages(response.messages);
      }
    } catch (err) {
      console.error("Error requesting messages", err);
    }
  }, [setMessages])
  
  return (
    <Container>
      <Button onClick={requestMessages}>Load messages</Button>

      <List>
        {messages.map(message => <ListItem>
          <ListItemText>{message.text}</ListItemText>
        </ListItem>)}
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

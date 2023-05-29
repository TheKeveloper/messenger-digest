import React, { useCallback, useState } from "react";
import { createRoot } from "react-dom/client";
import { MessengerMessage, sendRequestCurrentTab } from "./api/api";
import { Button } from "@mui/material";

const Popup = () => {
  const [messages, setMessages] = useState<MessengerMessage[]>([]);

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
    <div>
      <Button onClick={requestMessages}>Load messages</Button>
      {messages.map(message => <div>{message.text}</div>)}
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);

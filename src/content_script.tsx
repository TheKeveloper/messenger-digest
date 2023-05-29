import { ContentRequest, ContentResponse } from "./api/api";

chrome.runtime.onMessage.addListener(function (request: ContentRequest, sender, sendResponse: (response: ContentResponse) => void) {
  handleRequest(request).then(sendResponse).catch(error => sendResponse({
    type: "error",
    error
  }))
});

async function handleRequest(request: ContentRequest) : Promise<ContentResponse> {
  if (request.type === "messages") {
    return {
      type: "messages",
      messages: [
        {
          sender: "Test user",
          text: "test message"
        }
      ]
    }
  }

  return {
    type: "error",
    error: "Unrecognized message type"
  }
}

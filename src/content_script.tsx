import { ContentRequest, ContentResponse, MessagesRequest, MessagesResponse } from "./api/api";

chrome.runtime.onMessage.addListener(function (request: ContentRequest, sender, sendResponse: (response: ContentResponse) => void) {
  handleRequest(request).then(sendResponse).catch(error => sendResponse({
    type: "error",
    error
  }))
});

async function handleRequest(request: ContentRequest) : Promise<ContentResponse> {
  if (request.type === "messages") {
    return handleMessagesRequest(request);
  }

  return {
    type: "error",
    error: "Unrecognized message type"
  }
}

function handleMessagesRequest(_: MessagesRequest): MessagesResponse {
  const mainElement = document.querySelector('div[role="main"]');
  if (mainElement == null) {
    throw "No main element found";
  }
  return scrapeMessages(mainElement);
}

function scrapeMessages(mainElement: Element): MessagesResponse {
  const elements = mainElement.querySelectorAll("div[class='x6prxxf x1fc57z9 x1yc453h x126k92a xzsf02u']");

  const innerHtmls : string[] = [];
  for (const elt of elements.values()) {
    innerHtmls.push(elt.textContent ?? "");
  }

  return {
    type: "messages",
    messages: innerHtmls.map(text => {
      return { text };
    })
  };
}



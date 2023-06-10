import {
  ChatMessage,
  ContentRequest,
  ContentResponse,
  MessagesRequest,
  MessagesResponse,
} from "./api/api";

chrome.runtime.onMessage.addListener(function (
  request: ContentRequest,
  _,
  sendResponse: (response: ContentResponse) => void
) {
  handleRequest(request)
    .then(sendResponse)
    .catch((error) =>
      sendResponse({
        type: "error",
        error,
      })
    );
});

async function handleRequest(
  request: ContentRequest
): Promise<ContentResponse> {
  if (request.type === "messages") {
    return handleMessagesRequest(request);
  }

  return {
    type: "error",
    error: "Unrecognized message type",
  };
}

function handleMessagesRequest(_: MessagesRequest): MessagesResponse {
  const mainElement = document.querySelector('div[role="main"]');
  if (mainElement == null) {
    throw "No main element found";
  }
  return scrapeMessages(mainElement);
}

function scrapeMessages(mainElement: Element): MessagesResponse {
  const elementsWithUser = mainElement.querySelectorAll(
    "div[class='x78zum5 xdt5ytf x1n2onr6']"
  );

  let messages: ChatMessage[] = [];

  for (const eltWithUser of elementsWithUser.values()) {
    const maybeUserElt = eltWithUser.querySelector(
      "div[class='x78zum5 x1anpbxc x10b6aqq x1ye3gou x1nhvcw1']"
    );
    const maybeReply = eltWithUser.querySelector(
      "div[class='x12scifz x1pg5gke x1h0ha7o']"
    );

    const userText =
      maybeUserElt?.textContent ?? maybeReply?.textContent ?? undefined;

    const messageContentElt = eltWithUser.querySelector(
      "div[class='x6prxxf x1fc57z9 x1yc453h x126k92a xzsf02u']"
    );

    let messageContentText = messageContentElt?.textContent;
    if (messageContentText != null || userText != null) {
      messages.push({
        sender: userText,
        text: messageContentText ?? "",
      });
    }
  }

  console.log("messages: ", messages);

  return {
    type: "messages",
    messages,
  };
}

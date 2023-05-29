/**
 * Sent to the content script
 */
export type ContentRequest = MessagesRequest;

/**
 * Sent to request a series of messages
 */
export interface MessagesRequest {
  type: "messages";
}

/**
 * Response sent by the content script
 */
export type ContentResponse = MessagesResponse | ErrorResponse;

export interface MessagesResponse {
  type: "messages";
  messages: ChatMessage[];
}

export interface ErrorResponse {
  type: "error";
  error: any;
}

/**
 * A single messenger message including both the sender and the string contents of the message
 */
export interface ChatMessage {
  sender?: string;
  text: string;
}

export async function sendRequestCurrentTab(
  request: ContentRequest
): Promise<ContentResponse> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab?.id == null) {
        reject("No currently active tab");
        return;
      }

      chrome.tabs.sendMessage(tab.id, request, (response: ContentResponse) => {
        if (response.type == "error") {
          reject(response.error);
        } else {
          resolve(response);
        }
      });
    });
  });
}

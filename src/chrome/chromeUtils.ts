export async function getCurrentTabUrl(): Promise<string | undefined> {
  return new Promise((resolve, _) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      resolve(currentTab?.url);
    });
  });
}

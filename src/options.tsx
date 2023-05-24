import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { OpenAiConfiguration } from "./api/OpenAiConfiguration";
import { loadOpenAiConfiguration } from "./storage/storage";
import { LoadingState } from "./api/loading";

const Options = () => {
  const [openAiConfig, setOpenAiConfig] = useState<LoadingState<OpenAiConfiguration>>(LoadingState.loading());
  const [color, setColor] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [like, setLike] = useState<boolean>(false);

  useEffect(() => {
    loadOpenAiConfiguration().then(LoadingState.loaded).catch(error => {
      console.error("Error loading configuration", error);
      return LoadingState.failed(error);
    }).then(setOpenAiConfig)
  }, []);

  useEffect(() => {
    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    chrome.storage.sync.get(
      {
        favoriteColor: "red",
        likesColor: true,
      },
      (items) => {
        setColor(items.favoriteColor);
        setLike(items.likesColor);
      }
    );
  }, []);

  const saveOptions = () => {
    // Saves options to chrome.storage.sync.
    chrome.storage.sync.set(
      {
        favoriteColor: color,
        likesColor: like,
      },
      () => {
        // Update status to let user know options were saved.
        setStatus("Options saved.");
        const id = setTimeout(() => {
          setStatus("");
        }, 1000);
        return () => clearTimeout(id);
      }
    );
  };

  return (
    <React.Fragment>
      <div>
        API Key: { LoadingState.getLoaded(openAiConfig)?.apiKey ?? "Not found"}
      </div>
      <div>
        Favorite color: <select
          value={color}
          onChange={(event) => setColor(event.target.value)}
        >
          <option value="red">red</option>
          <option value="green">green</option>
          <option value="blue">blue</option>
          <option value="yellow">yellow</option>
        </select>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={like}
            onChange={(event) => setLike(event.target.checked)}
          />
          I like colors.
        </label>
      </div>
      <div>{status}</div>
      <button onClick={saveOptions}>Save</button>
    </React.Fragment>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);

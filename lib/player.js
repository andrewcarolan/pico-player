import defaults from "./options.js";
import throttle from "./throttle.js";
import { calculateRelativePosition } from "./rect.js";
import { replaceContent, createNode } from "./element.js";
import { playIcon, pauseIcon } from "./svg.js";
import template from "./template.js";

const players = [];

const init = (container = document, options = {}) => {
  options = Object.assign(defaults, options);

  const playerElements = container.querySelectorAll("[data-pico]");

  const onStartPlayback = (id) => {
    if (options.concurrent) {
      return;
    }

    for (const player of players.filter(({ getId }) => getId() !== id)) {
      player.stopPlayback();
    }
  };

  for (const [index, element] of playerElements.entries()) {
    const playerOptions = { ...options };

    const { pico } = element.dataset;

    if (pico) {
      Object.assign(playerOptions, JSON.parse(pico));
    }

    const player = createPlayer(element, index + 1, {
      ...playerOptions,
      onStartPlayback,
    });

    players.push(player);
  }
};

const formatDetails = ({ title, artist }) => {
  if (!title && !artist) {
    return;
  }

  return `${title ?? ""}${artist ? ` by ${artist}` : ""}`;
};

const pad = (number) => {
  return `${number < 10 ? "0" : ""}${number}`;
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);

  return `${minutes}:${pad(seconds)}`;
};

const createPlayerElement = (audioElement, options) => {
  // remember where the audio element was
  const { parentNode, nextElementSibling: nextNode } = audioElement;

  const playerElement = createNode(template);

  const audioElementSlot = playerElement.querySelector("slot#audio-element");
  audioElementSlot.replaceWith(audioElement);

  const details = formatDetails(options);
  if (details) {
    const detailsSlot = playerElement.querySelector("slot#details");
    detailsSlot.replaceWith(document.createTextNode(details));
  }

  if (nextNode) {
    parentNode.insertBefore(playerElement, nextNode);
  } else {
    parentNode.append(playerElement);
  }

  return playerElement;
};

const createPlayer = (element, id, options = {}) => {
  let isPlaying = false;
  let progress = 0;

  const togglePlayback = (event) => {
    event.stopPropagation();

    if (!isPlaying) {
      startPlayback();
    } else {
      stopPlayback();
    }
  };

  const startPlayback = () => {
    if (isPlaying) {
      return;
    }

    audioElement.play();
    isPlaying = true;
    replaceContent(playButton, pauseIcon, "⏸");

    options.onStartPlayback?.(id);
  };

  const stopPlayback = (progress) => {
    if (!isPlaying) {
      return;
    }

    audioElement.pause();
    isPlaying = false;
    replaceContent(playButton, playIcon, "▶️");

    if (typeof progress !== "undefined") {
      setProgress(progress);

      if (progress === 0) {
        // a `timeupdate` won't be fired in this case
        progressElement.style.transform = "scaleX(0)";
        displayTime(currentTime);
      }
    }
  };

  const displayProgress = (event) => {
    const { currentTime, duration } = event.target;

    if (currentTime >= duration) {
      return stopPlayback(0);
    }

    progress = currentTime / duration;
    progressElement.style.transform = `scaleX(${progress})`;
    displayTime(currentTime);
  };

  const displayTime = (seconds) => {
    if (!options?.showTime) {
      return;
    }

    timeElement.textContent = formatTime(seconds);
  };

  const updateProgress = (event) => {
    const [x] = calculateRelativePosition(element, event);
    const { width } = element.getBoundingClientRect();
    const offset = x / width;

    const { duration } = audioElement;
    setProgress(offset * duration);
  };

  const setProgress = (value) => {
    audioElement.currentTime = value;
  };

  const audioElement = element;

  if (!(audioElement instanceof HTMLAudioElement)) {
    throw Error("Player instance requires an HTMLAudioElement.");
  }

  element = createPlayerElement(audioElement, options);

  const progressElement = element.querySelector(".progress");
  const timeElement = element.querySelector(".time");
  const playButton = element.querySelector("#play-button");

  // remove no-script fallback
  element.classList.remove("no-script");
  audioElement.removeAttribute("controls");
  audioElement.style.display = "none";

  replaceContent(playButton, playIcon, "▶️");

  playButton.addEventListener("click", togglePlayback);
  element.addEventListener("click", updateProgress);

  audioElement.addEventListener(
    "timeupdate",
    throttle(displayProgress, options.updateInterval)
  );

  audioElement.addEventListener("ended", () => {
    stopPlayback(0);
  });

  return {
    getId: () => id,
    getProgress: () => progress,
    getIsPlaying: () => isPlaying,
    stopPlayback,
  };
};

export { init };

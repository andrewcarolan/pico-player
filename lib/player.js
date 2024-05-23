import defaults from "./options.js";
import throttle from "./throttle.js";
import { calculateRelativePosition } from "./rect.js";
import { replaceContent } from "./element.js";
import { playIcon, pauseIcon } from "./svg.js";

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
    const player = createPlayer(element, index + 1, {
      ...options,
      onStartPlayback,
    });
    players.push(player);
  }
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

  const audioElement = element.querySelector("audio");
  const progressElement = element.querySelector(".progress");
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

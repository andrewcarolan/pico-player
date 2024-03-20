import throttle from "./throttle.js";

const players = [];

const init = (container = document) => {
  const playerElements = container.querySelectorAll("[data-pico]");

  const onStartPlayback = (id) => {
    for (const player of players.filter(({ getId }) => getId() !== id)) {
      player.stopPlayback();
    }
  };

  for (const [index, element] of playerElements.entries()) {
    // prettier-ignore
    const player = createPlayer(
      element,
      index + 1,
      { onStartPlayback }
    );
    players.push(player);
  }
};

const createPlayer = (element, id, options = {}) => {
  let isPlaying = false;
  let progress = 0;
  options = Object.assign(
    {
      updateInterval: 100,
      onStartPlayback: () => {},
    },
    options
  );

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
    playButton.textContent = "⏸️";
    options.onStartPlayback(id);
  };

  const stopPlayback = (progress) => {
    if (!isPlaying) {
      return;
    }

    audioElement.pause();
    isPlaying = false;
    playButton.textContent = "▶️";

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
    const { offsetX: x, target } = event;
    const { offsetWidth: width } = target;
    const { duration } = audioElement;

    const offset = x / width;

    setProgress(offset * duration);
  };

  const setProgress = (value) => {
    audioElement.currentTime = value;
  };

  const audioElement = element.querySelector("audio");
  const progressElement = element.querySelector(".progress");
  const playButton = element.querySelector("#play-button");

  element.classList.remove("no-script");
  audioElement.controls = false;
  audioElement.style.display = "none";

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

import throttle from "./throttle.js";

const createPlayer = (element, options = {}) => {
  let isPlaying = false;
  let progress = 0;
  options = Object.assign(
    {
      updateInterval: 100,
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
    audioElement.play();
    isPlaying = true;
    playButton.textContent = "⏸️";
  };

  const stopPlayback = (progress) => {
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

  const progressElement = element.querySelector(".progress");
  const playButton = element.querySelector("#play-button");
  const audioElement = element.querySelector("audio");

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
    getProgress: () => progress,
    stopPlayback,
  };
};

export { createPlayer };

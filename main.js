import throttle from "./lib/throttle.js";

const startPlayback = (event) => {
  event.stopPropagation();

  if (!isPlaying) {
    audioElement.play();
    isPlaying = true;
    playButton.textContent = "⏸️";
  } else {
    audioElement.pause();
    isPlaying = false;
    playButton.textContent = "▶️";
  }

  audioElement.addEventListener(
    "timeupdate",
    throttle(updateProgress, UPDATE_INTERVAL)
  );
};

const updateProgress = (event) => {
  const { currentTime, duration } = event.target;

  progress = currentTime / duration;
  progressElement.style.transform = `scaleX(${progress})`;
};

const setProgress = (event) => {
  const { offsetX: x, target } = event;
  const { offsetWidth: width } = target;
  const { duration } = audioElement;

  const offset = x / width;

  audioElement.currentTime = offset * duration;
};

const UPDATE_INTERVAL = 100;

let progress = 0;
let isPlaying = false;

const player = document.querySelector(".player");

const progressElement = player.querySelector(".progress");
const playButton = player.querySelector("#play-button");
const audioElement = player.querySelector("audio");

playButton.addEventListener("click", startPlayback);
player.addEventListener("click", setProgress);

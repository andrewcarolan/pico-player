const throttle = (func, interval) => {
  let lastCall = 0;
  return function (...args) {
    let now = new Date();
    if (now - lastCall >= interval) {
      func(...args);
      lastCall = now;
    }
  };
};

const onTimeUpdate = (event) => {
  const { currentTime, duration } = event.target;

  // progress = currentTime / duration * 100;
  // progressElement.style.width = `${progress}%`;

  progress = currentTime / duration;
  progressElement.style.transform = `scaleX(${progress})`;
};

const UPDATE_INTERVAL = 100;

let progress = 0;
let isPlaying = false;

const player = document.querySelector(".player");

const progressElement = player.querySelector(".progress");
const playButton = player.querySelector("#play-button");
const audioElement = player.querySelector("audio");

playButton.addEventListener("click", (event) => {
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
    throttle(onTimeUpdate, UPDATE_INTERVAL)
  );
});

player.addEventListener("click", (event) => {
  const { offsetX: x, target } = event;
  const { offsetWidth: width } = event.target;
  const { duration } = audioElement;

  const offset = x / width;

  console.log(offset * duration);

  audioElement.currentTime = offset * duration;
});

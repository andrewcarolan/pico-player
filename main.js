import { createPlayer } from "./lib/player.js";

let players = [];
const playerElements = document.querySelectorAll("[data-pico]");

for (const element of playerElements) {
  const player = createPlayer(element);
  players.push(player);
}

console.log(players);

document.querySelector("#stop-all-button").addEventListener("click", () => {
  players.forEach(({ stopPlayback }) => stopPlayback(0));
});

// const player = document.querySelector(".player");

import { init } from "./lib/player.js";

// init();

//
// document.body.appendChild(content);

class AudioPlayer extends HTMLElement {
  constructor() {
    super();
    const { content } = document.getElementById("player-template");

    const shadowRoot = this.attachShadow({
      mode: "open",
    });
    shadowRoot.appendChild(content.cloneNode(true));
  }
}

customElements.define("audio-player", AudioPlayer);

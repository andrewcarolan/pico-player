export default `<div class="pico-player">
  <slot id="audio-element"></slot>
  <div class="controls">
    <button id="play-button">▶️</button>
    <span class="details"><slot id="title">Audio</slot></span>
  </div>
  <span class="progress"></span>
</div>`;

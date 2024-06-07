export default `<div class="pico-player">
  <div class="controls">
    <button id="play-button">▶️</button>
  </div>
  <div class="details">
    <span class="title">
      <slot id="details">Audio</slot>
    </span>
  </div>
  <div class="time"></div>
  <span class="progress"></span>
  <slot id="audio-element"></slot>
</div>`;

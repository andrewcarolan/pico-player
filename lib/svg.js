import { createSvgNode } from "./element.js";

const PLAY_ICON = `<path d="M16 8L2 0V16L16 8Z" />`;
const PAUSE_ICON = `<rect x="2" width="4" height="16"/>
<rect x="10" width="4" height="16"/>`;

const createSvg = (content, [width, height] = [16, 16]) => {
  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  ${content}
</svg>`;

  return createSvgNode(svg);
};

const playIcon = createSvg(PLAY_ICON);
const pauseIcon = createSvg(PAUSE_ICON);

export { playIcon, pauseIcon };

const clamp = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
};

const calculateRelativePosition = (
  element,
  { clientX: mouseX, clientY: mouseY }
) => {
  const rect = element.getBoundingClientRect();

  const x = clamp(mouseX - rect.x, 0, rect.width);
  const y = clamp(mouseY - rect.y, 0, rect.height);

  return [x, y];
};

export { clamp, calculateRelativePosition };

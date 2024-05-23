const removeContent = (element) => {
  while (element.firstChild) {
    element.firstChild.remove();
  }
};

const replaceContent = (element, node, fallback = "") => {
  removeContent(element);

  try {
    if (node.content instanceof DocumentFragment) {
      node = node.content;
    }

    element.append(node.cloneNode(true));
  } catch (_error) {
    element.textContent = fallback;
  }
};

const createNode = (mimeType, content) => {
  const { firstChild: node } = new DOMParser().parseFromString(
    content,
    mimeType
  );

  return node;
};

const createSvgNode = (content) => createNode("image/svg+xml", content);

export { removeContent, replaceContent, createNode, createSvgNode };

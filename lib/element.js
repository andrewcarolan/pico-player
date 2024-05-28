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

const createNode = (content, mimeType = "text/html") => {
  const document = new DOMParser().parseFromString(content, mimeType);

  if (document instanceof HTMLDocument) {
    return document.body.firstChild;
  } else if (document instanceof XMLDocument) {
    return document.firstChild;
  }
};

const createSvgNode = (content) => createNode(content, "image/svg+xml");

export { removeContent, replaceContent, createNode, createSvgNode };

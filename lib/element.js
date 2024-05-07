const removeContent = (element) => {
  while (element.firstChild) {
    element.firstChild.remove();
  }
};

const replaceContent = (element, fragment) => {
  removeContent(element);

  element.appendChild(fragment.content.cloneNode(true));
};

export { removeContent, replaceContent };

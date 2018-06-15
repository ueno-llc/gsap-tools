function getBounds(elm) {
  const margin = parseInt(window.getComputedStyle(elm).getPropertyValue('margin'), 10);
  const padding = parseInt(window.getComputedStyle(elm).getPropertyValue('padding'), 10);

  return margin > 0 ? margin : padding;
}

export default getBounds;

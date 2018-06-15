function getMatrix(elm) {
  const transform = window.getComputedStyle(elm).getPropertyValue('transform');
  const arr = transform.replace(/^matrix(3d)?\((.*)\)$/, '$2').split(/, /);

  return {
    tx: Number(arr[4]),
    ty: Number(arr[5]),
  };
}

export default getMatrix;

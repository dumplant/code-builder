/* eslint-disable */
export function userBlockDragger() {
  const mousemove = (e) => {};
  const mouseup = (e) => {
    document.removeEventListener('mousemove', mousemove);
    document.removeEventListener('mouseup', mouseup);
  };
  const mousedown = (e) => {
    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
  };
  return { mousedown };
}

export function getJson(str) {
  let regex = /\{.*\}/g;
  let matches = str.match(regex);
  return matches[0];
}

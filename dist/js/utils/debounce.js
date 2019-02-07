export default function debounce(fn, ms) {
  let timeoutId;

  return function wrapper() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, arguments);
    }, ms);
  };
}
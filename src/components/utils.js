export default function debounce(func, wait) {
  let timeout;
  return (...params) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...params);
    }, wait);
  };
}

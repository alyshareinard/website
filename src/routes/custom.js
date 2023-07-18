export function custom() {
  return {
    css: (t) => {
        return `opacity: ${t}; transform: scale(${t});`
    },
  }
}
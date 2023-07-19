//custom animation that scales and fades in/out
//add to component using transition:custom in the svelte tag
export function custom() {
  return {
    css: (t) => {
        return `opacity: ${t}; transform: scale(${t});`
    },
  }
}
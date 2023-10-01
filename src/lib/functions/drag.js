// spring lets you animate between values with a spring physics model
import { spring } from "svelte/motion"

export default function drag(node, params) {
  let x
  let y

  const coordinates = spring(
    { x: 0, y: 0 },
    {
      stiffness: 0.2,
      damping: 0.4,
    }
  )

  coordinates.subscribe(($coords) => {
    node.style.transform = `translate3d(${$coords.x}px, ${$coords.y}px,0)`
  })

  node.addEventListener("mousedown", handleMouseDown)
  node.addEventListener("touchstart", handleMouseDown)

  function handleMouseDown(event) {
    x = event.clientX
    y = event.clientY
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchstart", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("touchend", handleMouseUp)
    window.addEventListener("touchmove", handleMouseMove)
  }

  function handleMouseMove(event) {
    // Delta X = difference of where we clicked vs where we are currently
    const dx = event.clientX - x
    const dy = event.clientY - y
    x = event.clientX
    y = event.clientY
    coordinates.update(($coords) => {
      return {
        x: $coords.x + dx,
        y: $coords.y + dy,
      }
    })
  }

  function handleMouseUp() {
    // Fire up event
    node.dispatchEvent(
      new CustomEvent("dragStop", {
        detail: {
          x,
          y,
        },
      })
    )
    // Reset values
    x = 0
    y = 0
    coordinates.update(() => {
      return {
        x: 0,
        y: 0,
      }
    })
    // Remove event listers
    window.removeEventListener("mousemove", handleMouseMove)
    window.removeEventListener("mouseup", handleMouseUp)
    window.removeEventListener("touchstart", handleMouseUp)
    window.removeEventListener("touchend", handleMouseUp)
  }

  return {
    destroy() {
      node.removeEventListener("mousedown", () => console.log("clicks"))
    },
  }
}

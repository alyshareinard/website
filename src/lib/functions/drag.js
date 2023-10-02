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
  node.addEventListener("touchstart", handleTouchStart)

  function handleMouseDown(event) {
    x = event.clientX
    y = event.clientY
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

  }

  function handleTouchStart(event){
    x = event.touches[0].clientX
    y = event.touches[0].clientY
    window.addEventListener("touchend", handleTouchUp)
    window.addEventListener("touchmove", handleTouchMove)
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

  function handleTouchMove(event) {
    // Delta X = difference of where we clicked vs where we are currently
    const dx = event.touches[0].clientX - x
    const dy = event.touches[0].clientY - y
    x = event.touches[0].clientX
    y = event.touches[0].clientY
    coordinates.update(($coords) => {
      return {
        x: $coords.x + dx,
        y: $coords.y + dy,
      }
    })
  }

  function handleMouseUp() {
    console.log("Mouse up", x, y)
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
  }

  function handleTouchUp() {
    console.log("Touch up", x, y)
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

    window.removeEventListener("touchstart", handleTouchStart)
    window.removeEventListener("touchmove", handleTouchMove)
    window.removeEventListener("touchend", handleTouchUp)
  }

  return {
    destroy() {
      node.removeEventListener('touchstart', () => console.log("clicks"))
      node.removeEventListener("mousedown", () => console.log("clicks"))
    },
  }
}

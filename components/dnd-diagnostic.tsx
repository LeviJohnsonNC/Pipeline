"use client"

import { useEffect } from "react"

export function DndDiagnostic() {
  useEffect(() => {
    console.log("DndDiagnostic component mounted")

    // Log that we're using @dnd-kit
    console.log("Using @dnd-kit for drag and drop functionality")

    // Add specific event listeners for drag events
    const handlePointerDown = (e: PointerEvent) => {
      console.log("Pointer down:", {
        target: e.target,
        x: e.clientX,
        y: e.clientY,
        pointerType: e.pointerType,
        isPrimary: e.isPrimary,
      })
    }

    const handlePointerMove = (e: PointerEvent) => {
      // Only log if the primary button is pressed
      if (e.buttons > 0) {
        console.log("Pointer move with button pressed:", {
          x: e.clientX,
          y: e.clientY,
          pointerType: e.pointerType,
          buttons: e.buttons,
        })
      }
    }

    const handlePointerUp = (e: PointerEvent) => {
      console.log("Pointer up:", {
        target: e.target,
        x: e.clientX,
        y: e.clientY,
        pointerType: e.pointerType,
      })
    }

    // Add event listeners
    document.addEventListener("pointerdown", handlePointerDown, { passive: true })
    document.addEventListener("pointermove", handlePointerMove, { passive: true })
    document.addEventListener("pointerup", handlePointerUp, { passive: true })

    // Check for touch support
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0
    console.log("Touch support:", isTouchDevice)

    // Log screen dimensions
    console.log("Screen dimensions:", {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
    })

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("pointermove", handlePointerMove)
      document.removeEventListener("pointerup", handlePointerUp)
    }
  }, [])

  return null
}

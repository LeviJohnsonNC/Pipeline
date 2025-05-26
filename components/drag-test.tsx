"use client"

import { useEffect } from "react"

export function DragTest() {
  useEffect(() => {
    // Log when the component mounts to verify it's working
    console.log("DragTest component mounted")

    // Add event listeners to debug drag events
    const handleDragStart = (e: DragEvent) => {
      console.log("Drag started:", e.target)
    }

    const handleDrag = (e: DragEvent) => {
      console.log("Dragging:", e.clientX, e.clientY)
    }

    const handleDragEnd = (e: DragEvent) => {
      console.log("Drag ended:", e.target)
    }

    document.addEventListener("dragstart", handleDragStart)
    document.addEventListener("drag", handleDrag)
    document.addEventListener("dragend", handleDragEnd)

    return () => {
      document.removeEventListener("dragstart", handleDragStart)
      document.removeEventListener("drag", handleDrag)
      document.removeEventListener("dragend", handleDragEnd)
    }
  }, [])

  return null
}

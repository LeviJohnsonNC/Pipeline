"use client"

import { useEffect } from "react"

export function DragDiagnosticEnhanced() {
  useEffect(() => {
    console.log("Enhanced Drag Diagnostic mounted")

    // Test pointer events
    const testPointerEvents = () => {
      const leadCards = document.querySelectorAll('[data-testid^="lead-card-"]')
      console.log(`Found ${leadCards.length} lead cards`)

      leadCards.forEach((card, index) => {
        const computedStyle = window.getComputedStyle(card as Element)
        console.log(`Card ${index}:`, {
          cursor: computedStyle.cursor,
          pointerEvents: computedStyle.pointerEvents,
          userSelect: computedStyle.userSelect,
          touchAction: computedStyle.touchAction,
        })
      })
    }

    // Test after a short delay to ensure components are mounted
    setTimeout(testPointerEvents, 1000)

    // Add event listeners to track all pointer events
    const handlePointerDown = (e: PointerEvent) => {
      console.log("Global pointer down:", {
        target: e.target,
        tagName: (e.target as Element)?.tagName,
        className: (e.target as Element)?.className,
        x: e.clientX,
        y: e.clientY,
        pointerType: e.pointerType,
        isPrimary: e.isPrimary,
        button: e.button,
        buttons: e.buttons,
      })
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (e.buttons > 0) {
        console.log("Global pointer move with button:", {
          x: e.clientX,
          y: e.clientY,
          buttons: e.buttons,
        })
      }
    }

    const handlePointerUp = (e: PointerEvent) => {
      console.log("Global pointer up:", {
        target: e.target,
        x: e.clientX,
        y: e.clientY,
      })
    }

    // Add drag event listeners
    const handleDragStart = (e: DragEvent) => {
      console.log("Native drag start:", e.target)
    }

    const handleDrag = (e: DragEvent) => {
      console.log("Native drag:", e.clientX, e.clientY)
    }

    const handleDragEnd = (e: DragEvent) => {
      console.log("Native drag end:", e.target)
    }

    // Add all event listeners
    document.addEventListener("pointerdown", handlePointerDown, { passive: true })
    document.addEventListener("pointermove", handlePointerMove, { passive: true })
    document.addEventListener("pointerup", handlePointerUp, { passive: true })
    document.addEventListener("dragstart", handleDragStart)
    document.addEventListener("drag", handleDrag)
    document.addEventListener("dragend", handleDragEnd)

    // Check for @dnd-kit specific events
    const checkDndKitEvents = () => {
      console.log("Checking for @dnd-kit events...")

      // Look for dnd-kit specific attributes
      const dndElements = document.querySelectorAll("[data-dnd-draggable]")
      console.log(`Found ${dndElements.length} dnd-kit draggable elements`)

      dndElements.forEach((el, index) => {
        console.log(`DnD element ${index}:`, {
          id: el.id,
          "data-dnd-draggable": el.getAttribute("data-dnd-draggable"),
          "aria-describedby": el.getAttribute("aria-describedby"),
        })
      })
    }

    setTimeout(checkDndKitEvents, 2000)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("pointermove", handlePointerMove)
      document.removeEventListener("pointerup", handlePointerUp)
      document.removeEventListener("dragstart", handleDragStart)
      document.removeEventListener("drag", handleDrag)
      document.removeEventListener("dragend", handleDragEnd)
    }
  }, [])

  return null
}

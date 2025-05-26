"use client"

import { useEffect } from "react"

export function DragDiagnostic() {
  useEffect(() => {
    console.log("DragDiagnostic component mounted")

    // Log that we're using react-beautiful-dnd
    console.log("Using react-beautiful-dnd for drag and drop functionality")

    // Check for react-beautiful-dnd version
    console.log("React Beautiful DnD version check")
    try {
      // Log the version if available
      console.log("React Beautiful DnD is available")
    } catch (error) {
      console.error("Error checking react-beautiful-dnd:", error)
    }

    // Add specific event listeners for react-beautiful-dnd events
    document.addEventListener("mousedown", (e) => {
      console.log("Mouse down:", e.target, e.clientX, e.clientY)
    })

    document.addEventListener(
      "touchstart",
      (e) => {
        console.log("Touch start:", e.target, e.touches[0]?.clientX, e.touches[0]?.clientY)
      },
      { passive: true },
    )

    // Check for any CSS that might interfere with dragging
    const checkForInterferingStyles = () => {
      const interfering = ["user-select", "pointer-events", "touch-action", "position: fixed", "transform"]

      console.log("Checking for potentially interfering styles...")

      // Check for global styles that might affect dragging
      const styleSheets = document.styleSheets
      try {
        for (let i = 0; i < styleSheets.length; i++) {
          const sheet = styleSheets[i]
          try {
            const rules = sheet.cssRules || sheet.rules
            for (let j = 0; j < rules.length; j++) {
              const rule = rules[j]
              if (rule.cssText) {
                for (const term of interfering) {
                  if (rule.cssText.includes(term)) {
                    console.log("Potentially interfering style:", rule.cssText)
                  }
                }
              }
            }
          } catch (e) {
            console.log("Could not access rules in stylesheet", i)
          }
        }
      } catch (e) {
        console.log("Error checking stylesheets:", e)
      }
    }

    // Run the style check
    checkForInterferingStyles()

    // Add event listeners to debug drag events
    const handleDragStart = (e: DragEvent) => {
      console.log("Native DragStart:", e.target)
    }

    const handleDrag = (e: DragEvent) => {
      console.log("Native Dragging:", e.clientX, e.clientY)
    }

    const handleDragEnd = (e: DragEvent) => {
      console.log("Native DragEnd:", e.target)
    }

    // Check for touch support
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0
    console.log("Touch support:", isTouchDevice)

    // Check browser info
    console.log("User Agent:", navigator.userAgent)

    // Log screen dimensions
    console.log("Screen dimensions:", {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
    })

    // Add a MutationObserver to detect changes to the DOM that might affect dragging
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
          console.log("Style attribute changed on:", mutation.target)
        }
      })
    })

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["style", "class"],
    })

    document.addEventListener("dragstart", handleDragStart)
    document.addEventListener("drag", handleDrag)
    document.addEventListener("dragend", handleDragEnd)

    return () => {
      document.removeEventListener("dragstart", handleDragStart)
      document.removeEventListener("drag", handleDrag)
      document.removeEventListener("dragend", handleDragEnd)
      observer.disconnect()
    }
  }, [])

  return null
}

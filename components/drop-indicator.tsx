interface DropIndicatorProps {
  columnId: string
  index: number
  cardHeight: number
}

export function DropIndicator({ columnId, index, cardHeight }: DropIndicatorProps) {
  return (
    <div
      className="drop-indicator-line"
      style={{
        position: "absolute",
        left: "4px",
        right: "4px",
        height: "2px",
        backgroundColor: "#166534",
        zIndex: 5,
        top: `${index * (cardHeight + 16)}px`,
        transform: "translateY(-50%)",
        pointerEvents: "none",
        borderRadius: "1px",
      }}
    />
  )
}

"use client"
import type React from "react"

type ResumeElement = {
  id: string
  type: "heading" | "text" | "section" | "paragraph" | "list"
  content: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: string
  fontStyle?: string
  textDecoration?: string
  textAlign?: string
  color?: string
  backgroundColor?: string
  x: number
  y: number
  width: number
  height: number
  lineHeight?: number
  children?: ResumeElement[]
  listType?: "bullet" | "number"
}

interface CanvasElementProps {
  element: ResumeElement
  isSelected: boolean
  isDragging: boolean
  draggingId: string | null
  onElementClick: (e: React.MouseEvent, id: string) => void
  onMouseDown: (e: React.MouseEvent, id: string) => void
  onDoubleClick: (e: React.MouseEvent, id: string, element: ResumeElement) => void
  onMouseEnter: (e: React.MouseEvent) => void
  onMouseLeave: (e: React.MouseEvent) => void
  renderElement: (el: ResumeElement) => React.ReactNode
  formatTextContent: (element: ResumeElement) => React.ReactNode
}

// Function to ensure color is in safe format (RGB or hex)
const ensureSafeColor = (color: string | undefined): string | undefined => {
  if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
    return color
  }
  
  // If it's already hex or rgb, return as-is
  if (color.startsWith('#') || color.startsWith('rgb')) {
    return color
  }
  
  // If it's a modern color function, we need to convert it
  if (color.includes('lab(') || color.includes('lch(') || color.includes('oklab(') || color.includes('oklch(')) {
    // Create a temporary element to compute the RGB value
    const tempDiv = document.createElement('div')
    tempDiv.style.color = color
    tempDiv.style.position = 'fixed'
    tempDiv.style.opacity = '0'
    tempDiv.style.pointerEvents = 'none'
    document.body.appendChild(tempDiv)
    
    const computedColor = getComputedStyle(tempDiv).color
    document.body.removeChild(tempDiv)
    
    return computedColor || '#000000'
  }
  
  return color
}

const formatTextContent = (element: ResumeElement): React.ReactNode => {
  // Ensure safe colors for text content
  const safeColor = ensureSafeColor(element.color)
  
  if (element.type === "list") {
    const items = element.content.split("\n").filter((item) => item.trim())
    return (
      <div style={{ color: safeColor }}>
        {items.map((item, index) => (
          <div key={index} style={{ display: "flex", alignItems: "flex-start", marginBottom: 4 }}>
            <span style={{ marginRight: 8 }}>{element.listType === "number" ? `${index + 1}.` : "•"}</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    )
  }

  if (element.type === "heading") {
    return (
      <h1 style={{ 
        margin: 0, 
        fontSize: element.fontSize,
        color: safeColor,
        fontFamily: element.fontFamily,
        fontWeight: element.fontWeight
      }}>
        {element.content}
      </h1>
    )
  }

  if (element.type === "paragraph") {
    return (
      <p style={{ 
        margin: 0, 
        fontSize: element.fontSize,
        color: safeColor,
        fontFamily: element.fontFamily,
        fontWeight: element.fontWeight
      }}>
        {element.content}
      </p>
    )
  }

  return <span style={{ color: safeColor }}>{element.content}</span>
}

export const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  isSelected,
  isDragging,
  draggingId,
  onElementClick,
  onMouseDown,
  onDoubleClick,
  onMouseEnter,
  onMouseLeave,
  renderElement,
}) => {
  // Ensure all colors are in safe formats
  const safeColor = ensureSafeColor(element.color)
  const safeBackgroundColor = ensureSafeColor(
    element.backgroundColor === "transparent" ? undefined : element.backgroundColor
  )

  const style: React.CSSProperties = {
    position: "absolute",
    left: element.x,
    top: element.y,
    width: element.width,
    minHeight: element.height,
    fontSize: element.fontSize,
    fontFamily: element.fontFamily,
    fontWeight: element.fontWeight,
    fontStyle: element.fontStyle,
    textDecoration: element.textDecoration,
    textAlign: element.textAlign as any,
    color: safeColor,
    backgroundColor: safeBackgroundColor,
    lineHeight: element.lineHeight,
    margin: 0,
    padding: "8px 12px",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    overflow: "visible",
    cursor: isDragging && draggingId === element.id ? "grabbing" : "move",
    border: isSelected ? "2px solid #3b82f6" : "1px solid transparent",
    userSelect: "none",
    borderRadius: "4px",
    transition: "border 0.15s ease",
    boxSizing: "border-box",
  }

  if (element.type === "section") {
    return (
      <div
        key={element.id}
        style={style}
        onClick={(e) => onElementClick(e, element.id)}
        onMouseDown={(e) => onMouseDown(e, element.id)}
        onDoubleClick={(e) => onDoubleClick(e, element.id, element)}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {element.children && element.children.map((child) => renderElement(child))}
      </div>
    )
  }

  return (
    <div
      key={element.id}
      style={style}
      onClick={(e) => onElementClick(e, element.id)}
      onMouseDown={(e) => onMouseDown(e, element.id)}
      onDoubleClick={(e) => onDoubleClick(e, element.id, element)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {formatTextContent(element)}
    </div>
  )
}
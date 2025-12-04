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

interface ResumeCanvasProps {
  elements: ResumeElement[]
  selectedId: string | null
  selectedIds: string[]
  isDragging: boolean
  draggingId: string | null
  zoom: number
  showGrid: boolean
  resumeRef: React.RefObject<HTMLDivElement | null >
  resumeBackground: string
  onElementClick: (e: React.MouseEvent, id: string) => void
  onMouseDown: (e: React.MouseEvent, id: string) => void
  onDoubleClick: (e: React.MouseEvent, id: string, element: ResumeElement) => void
  renderElement: (el: ResumeElement) => React.ReactNode
  onCanvasClick: () => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onToggleGrid?: () => void
  onToggleGroupSelect?: () => void
  isGroupSelect?: boolean
  selectedElement?: ResumeElement | null
}

// Function to ensure color is in safe format (RGB or hex)
const ensureSafeColor = (color: string | undefined): string => {
  if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
    return color || 'transparent'
  }
  
  // If it's already hex or rgb, return as-is
  if (color.startsWith('#') || color.startsWith('rgb')) {
    return color
  }
  
  // If it's a modern color function, convert it to RGB
  if (color.includes('lab(') || color.includes('lch(') || color.includes('oklab(') || color.includes('oklch(')) {
    try {
      // Create a temporary element to compute the RGB value
      const tempDiv = document.createElement('div')
      tempDiv.style.color = color
      tempDiv.style.position = 'fixed'
      tempDiv.style.opacity = '0'
      tempDiv.style.pointerEvents = 'none'
      tempDiv.style.left = '-9999px' // Move off-screen
      document.body.appendChild(tempDiv)
      
      const computedColor = getComputedStyle(tempDiv).color
      document.body.removeChild(tempDiv)
      
      return computedColor || '#ffffff' // Fallback to white
    } catch (error) {
      console.warn('Failed to convert color:', color, error)
      return '#ffffff' // Fallback to white
    }
  }
  
  // For named colors or other formats, return as-is (browser will handle them)
  return color
}

export const ResumeCanvas: React.FC<ResumeCanvasProps> = ({
  elements,
  selectedId,
  selectedIds,
  isDragging,
  draggingId,
  zoom,
  showGrid,
  resumeRef,
  resumeBackground,
  onElementClick,
  onMouseDown,
  onDoubleClick,
  renderElement,
  onCanvasClick,
  onZoomIn,
  onZoomOut,
  onToggleGrid,
  onToggleGroupSelect,
  isGroupSelect = false,
  selectedElement = null,
}) => {
  // Ensure the resume background color is safe
  const safeResumeBackground = ensureSafeColor(resumeBackground)

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top Toolbar */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid #e2e8f0",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {selectedElement ? (
            <>
              <div
                style={{
                  padding: "6px 12px",
                  background: "#eff6ff",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#3b82f6",
                }}
              >
                {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)}
              </div>
              <span style={{ fontSize: 13, color: "#64748b" }}>Selected</span>
            </>
          ) : selectedIds.length > 0 ? (
            <>
              <div
                style={{
                  padding: "6px 12px",
                  background: "#f3e8ff",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#8b5cf6",
                }}
              >
                Group
              </div>
              <span style={{ fontSize: 13, color: "#64748b" }}>{selectedIds.length} elements selected</span>
            </>
          ) : (
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              Click any element to select • Shift+Click for group select
            </span>
          )}
        </div>
        <div
          style={{
            padding: "8px 16px",
            background: "#fef3c7",
            borderRadius: 6,
            fontSize: 12,
            color: "#92400e",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          💡 Single click = select • Double click = edit • Drag = move
        </div>
      </div>

      {/* Canvas Area */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: 40,
          background: showGrid
            ? "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)"
            : "transparent",
          backgroundSize: showGrid ? "20px 20px" : "auto",
        }}
        onClick={onCanvasClick}
      >
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            transition: "transform 0.2s ease",
          }}
        >
         <div
  style={{
    background: safeResumeBackground,
    border:"1px solid black",
    width: "794px",          
    minHeight: "1123px",     
    overflow: "visible",
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
    borderRadius: 8,
  }}
  ref={resumeRef}
>
  {elements.map((el) => renderElement(el))}
</div>

        </div>
      </div>
    </div>
  )
}
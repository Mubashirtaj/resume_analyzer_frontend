"use client"
import type React from "react"
import { Bold, Italic, Underline, Trash2, Type } from "lucide-react"

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

interface ElementPropertiesProps {
  selectedElement: ResumeElement | null
  editingText: boolean
  onStartEdit: () => void
  onBackgroundChange: (color: string) => void
  onToggleBold: () => void
  onToggleItalic: () => void
  onToggleUnderline: () => void
  onDelete: () => void
  onTransparent: () => void
}

export const ElementProperties: React.FC<ElementPropertiesProps> = ({
  selectedElement,
  editingText,
  onStartEdit,
  onBackgroundChange,
  onToggleBold,
  onToggleItalic,
  onToggleUnderline,
  onDelete,
  onTransparent,
}) => {
  if (!selectedElement) return null

  return (
    <div style={{ marginBottom: 24 }}>
      <h3
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#475569",
          marginBottom: 12,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {editingText ? "Text Editor" : "Element Properties"}
      </h3>

      {!editingText && (
        <>
          <button
            onClick={onStartEdit}
            style={{
              width: "100%",
              padding: "10px 12px",
              background: "#eff6ff",
              color: "#3b82f6",
              border: "1px solid #dbeafe",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Type size={16} />
            Open Text Editor
          </button>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#64748b", marginBottom: 6 }}>
              Background
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="color"
                value={
                  selectedElement.backgroundColor === "transparent"
                    ? "#ffffff"
                    : selectedElement.backgroundColor || "#ffffff"
                }
                onChange={(e) => onBackgroundChange(e.target.value)}
                style={{
                  width: 50,
                  height: 40,
                  border: "1px solid #e2e8f0",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              />
              <button
                onClick={onTransparent}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 6,
                  fontSize: 12,
                  background: selectedElement.backgroundColor === "transparent" ? "#3b82f6" : "white",
                  color: selectedElement.backgroundColor === "transparent" ? "white" : "#475569",
                  cursor: "pointer",
                }}
              >
                Transparent
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button
              onClick={onToggleBold}
              style={{
                flex: 1,
                padding: "10px",
                background: selectedElement.fontWeight === "bold" ? "#3b82f6" : "#f8fafc",
                color: selectedElement.fontWeight === "bold" ? "white" : "#475569",
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bold size={16} />
            </button>
            <button
              onClick={onToggleItalic}
              style={{
                flex: 1,
                padding: "10px",
                background: selectedElement.fontStyle === "italic" ? "#3b82f6" : "#f8fafc",
                color: selectedElement.fontStyle === "italic" ? "white" : "#475569",
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Italic size={16} />
            </button>
            <button
              onClick={onToggleUnderline}
              style={{
                flex: 1,
                padding: "10px",
                background: selectedElement.textDecoration === "underline" ? "#3b82f6" : "#f8fafc",
                color: selectedElement.textDecoration === "underline" ? "white" : "#475569",
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Underline size={16} />
            </button>
          </div>

          <button
            onClick={onDelete}
            style={{
              width: "100%",
              padding: "10px 16px",
              background: "#fee2e2",
              color: "#dc2626",
              border: "1px solid #fecaca",
              borderRadius: 6,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 500,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fecaca")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fee2e2")}
          >
            <Trash2 size={16} />
            Delete Element
          </button>
        </>
      )}
    </div>
  )
}

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

interface TextEditorPanelProps {
  editingText: boolean
  tempContent: string
  onContentChange: (content: string) => void
  onSave: () => void
  onCancel: () => void
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
}

export const TextEditorPanel: React.FC<TextEditorPanelProps> = ({
  editingText,
  tempContent,
  onContentChange,
  onSave,
  onCancel,
  textareaRef,
}) => {
  if (!editingText) return null

  return (
    <div>
      <textarea
        ref={textareaRef}
        value={tempContent}
        onChange={(e) => onContentChange(e.target.value)}
        style={{
          width: "100%",
          minHeight: 120,
          padding: "10px",
          border: "1px solid #e2e8f0",
          borderRadius: 6,
          fontSize: 13,
          fontFamily: "inherit",
          resize: "vertical",
          marginBottom: 8,
          boxSizing: "border-box",
        }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={onSave}
          style={{
            flex: 1,
            padding: "8px 12px",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          Save
        </button>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: "8px 12px",
            background: "#f8fafc",
            color: "#475569",
            border: "1px solid #e2e8f0",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

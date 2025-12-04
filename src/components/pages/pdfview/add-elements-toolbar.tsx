"use client"
import type React from "react"
import { Type, Heading, Pilcrow, List } from "lucide-react"

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

interface AddElementsToolbarProps {
  onAddElement: (type: ResumeElement["type"]) => void
}

export const AddElementsToolbar: React.FC<AddElementsToolbarProps> = ({ onAddElement }) => {
  const buttonStyle = {
    padding: "10px 12px" as const,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    cursor: "pointer" as const,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 6,
    fontSize: 12,
    fontWeight: 500 as const,
    color: "#475569",
    transition: "all 0.2s",
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = "#eff6ff"
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = "#f8fafc"
  }

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
        Add Elements
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
        <button
          onClick={() => onAddElement("text")}
          style={buttonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Type size={16} />
          Text
        </button>
        <button
          onClick={() => onAddElement("heading")}
          style={buttonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Heading size={16} />
          Heading
        </button>
        <button
          onClick={() => onAddElement("paragraph")}
          style={buttonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Pilcrow size={16} />
          Paragraph
        </button>
        <button
          onClick={() => onAddElement("list")}
          style={buttonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <List size={16} />
          List
        </button>
      </div>
    </div>
  )
}

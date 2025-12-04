"use client"
import type React from "react"
import { useRef } from "react"
import { Save, Share2, RotateCcw, Trash2, Download } from "lucide-react"
import { AddElementsToolbar } from "./add-elements-toolbar"
import { ElementProperties } from "./element-properties"
import { TextEditorPanel } from "./text-editor-panel"

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

interface SidebarProps {
  hasUnsavedChanges: boolean
  selectedElement: ResumeElement | null
  selectedIds: string[]
  editingText: boolean
  tempContent: string
  zoom?:number
  showGrid?:boolean
  isGroupSelect?:boolean
  onZoomIn?: ()=> void
  onZoomOut?: ()=> void
  onToggleGrid?: ()=> void
  onToggleGroupSelect?: ()=> void
  onAddElement: (type: ResumeElement["type"]) => void
  onStartEdit: () => void
  onSaveText: () => void
  onCancelEdit: () => void
  onTempContentChange: (content: string) => void
  onBackgroundChange: (color: string) => void
  onToggleBold: () => void
  onToggleItalic: () => void
  onToggleUnderline: () => void
  onDeleteElement: () => void
  onTransparent: () => void
  onDeleteSelected: () => void
  onSave: () => void
  onShare: () => void
  onReset: () => void
  onDownloadPDF: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  hasUnsavedChanges,
  selectedElement,
  selectedIds,
  editingText,
  tempContent,
  onAddElement,
  onStartEdit,
  onSaveText,
  onCancelEdit,
  onTempContentChange,
  onBackgroundChange,
  onToggleBold,
  onToggleItalic,
  onToggleUnderline,
  onDeleteElement,
  onTransparent,
  onDeleteSelected,
  onSave,
  onShare,
  onReset,
  onDownloadPDF,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  return (
    <div
      style={{
        width: 320,
        background: "white",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div style={{ padding: 20, borderBottom: "1px solid #e2e8f0" }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1e293b" }}>Resume Editor</h2>
        <p style={{ margin: "8px 0 0 0", fontSize: 13, color: "#64748b" }}>Professional Design Tool</p>

        {hasUnsavedChanges && (
          <div
            style={{
              marginTop: 8,
              padding: "6px 12px",
              background: "#fef3c7",
              borderRadius: 4,
              fontSize: 12,
              color: "#92400e",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div style={{ width: 8, height: 8, background: "#f59e0b", borderRadius: "50%" }}></div>
            Unsaved changes
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 20, flex: 1 }}>
        <AddElementsToolbar onAddElement={onAddElement} />

        {editingText && (
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
              Text Editor
            </h3>
            <TextEditorPanel
              editingText={editingText}
              tempContent={tempContent}
              onContentChange={onTempContentChange}
              onSave={onSaveText}
              onCancel={onCancelEdit}
              textareaRef={textareaRef}
            />
          </div>
        )}

        <ElementProperties
          selectedElement={selectedElement}
          editingText={editingText}
          onStartEdit={onStartEdit}
          onBackgroundChange={onBackgroundChange}
          onToggleBold={onToggleBold}
          onToggleItalic={onToggleItalic}
          onToggleUnderline={onToggleUnderline}
          onDelete={onDeleteElement}
          onTransparent={onTransparent}
        />

        {selectedIds.length > 0 && (
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
              Group Actions
            </h3>
            <button
              onClick={onDeleteSelected}
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
              Delete {selectedIds.length} Elements
            </button>
          </div>
        )}

        {/* Actions */}
        <div>
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
            Actions
          </h3>

          <button
            onClick={onSave}
            disabled={!hasUnsavedChanges}
            style={{
              width: "100%",
              padding: "10px 16px",
              background: hasUnsavedChanges ? "#10b981" : "#d1fae5",
              color: hasUnsavedChanges ? "white" : "#065f46",
              border: "none",
              borderRadius: 6,
              cursor: hasUnsavedChanges ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 12,
              transition: "all 0.2s",
              opacity: hasUnsavedChanges ? 1 : 0.7,
            }}
          >
            <Save size={16} />
            Save Resume
          </button>

          <button
            onClick={onShare}
            style={{
              width: "100%",
              padding: "10px 16px",
              background: "#f8fafc",
              color: "#475569",
              border: "1px solid #e2e8f0",
              borderRadius: 6,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 12,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f8fafc")}
          >
            <Share2 size={16} />
            Share CV
          </button>

          <button
            onClick={onDownloadPDF}
            style={{
              width: "100%",
              padding: "10px 16px",
              background: "#f8fafc",
              color: "#475569",
              border: "1px solid #e2e8f0",
              borderRadius: 6,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 12,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f8fafc")}
          >
            <Download size={16} />
            Download PDF
          </button>

          <button
            onClick={onReset}
            style={{
              width: "100%",
              padding: "10px 16px",
              background: "#f8fafc",
              color: "#475569",
              border: "1px solid #e2e8f0",
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
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f8fafc")}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

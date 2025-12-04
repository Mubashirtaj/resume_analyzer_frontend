"use client"
import type React from "react"
import { useState, useRef } from "react"
import { toPng } from "html-to-image"
import html2pdf from "html2pdf.js"
import jsPDF from "jspdf"
import { Sidebar } from "./sidebar"
import { ResumeCanvas } from "./resume-canvas"
import { ShareModal } from "./share-modal"
import { CanvasElement } from "./canvas-element"
import {  PrintResume } from "@/app/utils/exportResumeTextPDF"
const normalizeColors = (node: HTMLElement) => {
  const elements = node.querySelectorAll("*");
  elements.forEach((el: HTMLElement) => {
    const computed = getComputedStyle(el);
    const color = computed.color;
    const bg = computed.backgroundColor;
    el.style.color = color;
    el.style.backgroundColor = bg;
  });
};

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

type ResumeJSON = {
  background: string
  layout: string
  elements: ResumeElement[]
}

interface Props {
  resume: ResumeJSON
  onSave?: (resume: ResumeJSON) => void
}

export const EditableResume: React.FC<Props> = ({ resume, onSave }) => {
  const resumeRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [resumeData, setResumeData] = useState<ResumeJSON>(resume)
  const [elements, setElements] = useState(resume.elements)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [zoom, setZoom] = useState(100)
  const [showGrid, setShowGrid] = useState(false)
  const [isGroupSelect, setIsGroupSelect] = useState(false)
  const [editingText, setEditingText] = useState(false)
  const [tempContent, setTempContent] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareLink, setShareLink] = useState("")

  const updateElements = (newElements: ResumeElement[]) => {
    setElements(newElements)
    setHasUnsavedChanges(true)
  }

  const updateElement = (id: string, props: Partial<ResumeElement>) => {
    const updateRecursive = (els: ResumeElement[]): ResumeElement[] =>
      els.map((el) => {
        if (el.id === id) return { ...el, ...props }
        if (el.children) {
          return { ...el, children: updateRecursive(el.children) }
        }
        return el
      })
    const updatedElements = updateRecursive(elements)
    updateElements(updatedElements)
  }

  const deleteElement = (id: string) => {
    const deleteRecursive = (els: ResumeElement[]): ResumeElement[] =>
      els.filter((el) => {
        if (el.id === id) return false
        if (el.children) {
          el.children = deleteRecursive(el.children)
        }
        return true
      })
    const updatedElements = deleteRecursive(elements)
    updateElements(updatedElements)
    setSelectedId(null)
  }

  const deleteSelectedElements = () => {
    if (selectedIds.length === 0) return
    let updatedElements = elements
    selectedIds.forEach((id) => {
      updatedElements = updatedElements.filter((el) => el.id !== id)
    })
    updateElements(updatedElements)
    setSelectedIds([])
    setSelectedId(null)
  }

  const addElement = (type: ResumeElement["type"]) => {
    const baseElement: Omit<ResumeElement, "id"> = {
      type,
      content: "",
      fontSize: 14,
      fontFamily: "Arial",
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: "left",
      color: "#000000",
      backgroundColor: "transparent",
      x: 100,
      y: 100,
      width: 300,
      height: 40,
      lineHeight: 1.4,
    }

    const elementConfigs = {
      text: { content: "Double click to edit text", width: 300, height: 40 },
      heading: { content: "Heading", fontSize: 24, fontWeight: "bold", width: 300, height: 50 },
      paragraph: { content: "Lorem ipsum dolor sit amet...", width: 400, height: 80 },
      list: { content: "Item 1\nItem 2\nItem 3", listType: "bullet" as const, width: 300, height: 80 },
      section: { content: "", backgroundColor: "#f0f0f0", width: 200, height: 100, children: [] },
    }

    const newElement: ResumeElement = {
      ...baseElement,
      ...elementConfigs[type],
      id: `${type}_${Date.now()}`,
    }

    const updatedElements = [...elements, newElement]
    updateElements(updatedElements)
    setSelectedId(newElement.id)
  }

  const handleElementClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()

    if (isGroupSelect && e.shiftKey) {
      setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
    } else {
      setSelectedId(id)
      setSelectedIds([])
      const element = findElementById(elements, id)
      if (element) {
        setTempContent(element.content)
      }
    }
  }

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    if (e.detail === 2) return

    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    setDraggingId(id)

    if (!isGroupSelect) {
      setSelectedId(id)
    }

    const startX = e.clientX
    const startY = e.clientY

    const elementsToMove =
      isGroupSelect && selectedIds.includes(id)
        ? (selectedIds.map((sid) => findElementById(elements, sid)).filter(Boolean) as ResumeElement[])
        : ([findElementById(elements, id)].filter(Boolean) as ResumeElement[])

    const startPositions = elementsToMove.map((el) => ({ id: el.id, x: el.x, y: el.y }))

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startX) / (zoom / 100)
      const deltaY = (moveEvent.clientY - startY) / (zoom / 100)

      startPositions.forEach(({ id, x, y }) => {
        const element = findElementById(elements, id)
        if (!element) return

        const newX = Math.max(0, Math.min(800 - element.width, x + deltaX))
        const newY = Math.max(0, Math.min(1200 - element.height, y + deltaY))

        updateElement(id, { x: newX, y: newY })
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setDraggingId(null)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const findElementById = (els: ResumeElement[], id: string): ResumeElement | null => {
    for (const el of els) {
      if (el.id === id) return el
      if (el.children) {
        const found = findElementById(el.children, id)
        if (found) return found
      }
    }
    return null
  }

  const selectedElement = selectedId ? findElementById(elements, selectedId) : null

  const startTextEdit = () => {
    if (selectedElement) {
      setEditingText(true)
      setTempContent(selectedElement.content)
      setTimeout(() => textareaRef.current?.focus(), 100)
    }
  }

  const saveTextEdit = () => {
    if (selectedId) {
      updateElement(selectedId, { content: tempContent })
      setEditingText(false)
    }
  }

  const handleSaveResume = () => {
    const updatedResume: ResumeJSON = {
      ...resumeData,
      elements: elements,
    }

    setResumeData(updatedResume)
    setHasUnsavedChanges(false)

    if (onSave) {
      onSave(updatedResume)
    }
  }

  const handleShareResume = async () => {
    try {
      const resumeDataToShare = {
        ...resumeData,
        elements: elements,
      }

      const shareData = btoa(JSON.stringify(resumeDataToShare))
      const baseUrl = window.location.origin
      const shareUrl = `${baseUrl}/resume/share?data=${shareData}`

      setShareLink(shareUrl)
      setShowShareModal(true)

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl)
      }
    } catch (error) {
      console.error("Error sharing resume:", error)
    }
  }

const handleDownloadPDF = async () => {
  console.log(resumeRef.current?.innerHTML);
  
 PrintResume(resumeRef)
};


  const formatTextContent = (element: ResumeElement) => {
    if (element.type === "list") {
      const items = element.content.split("\n").filter((item) => item.trim())
      return (
        <div>
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
      return <h1 style={{ margin: 0, fontSize: element.fontSize }}>{element.content}</h1>
    }

    if (element.type === "paragraph") {
      return <p style={{ margin: 0, fontSize: element.fontSize }}>{element.content}</p>
    }

    return element.content
  }

  const renderElement = (el: ResumeElement): React.ReactNode => {
    const isSelected = selectedId === el.id || selectedIds.includes(el.id)

    return (
      <CanvasElement
        key={el.id}
        element={el}
        isSelected={isSelected}
        isDragging={isDragging}
        draggingId={draggingId}
        onElementClick={handleElementClick}
        onMouseDown={handleMouseDown}
        onDoubleClick={startTextEdit}
        onMouseEnter={(e) => {
          if (!isSelected && !isDragging) {
            e.currentTarget.style.border  = "1px dashed #94a3b8" 
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.border = "1px solid transparent"
          }
        }}
        renderElement={renderElement}
        formatTextContent={formatTextContent}
      />
    )
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "linear-gradient(to br, #f8fafc, #e2e8f0)",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <Sidebar
        hasUnsavedChanges={hasUnsavedChanges}
        selectedElement={selectedElement}
        selectedIds={selectedIds}
        editingText={editingText}
        tempContent={tempContent}
        zoom={zoom}
        showGrid={showGrid}
        isGroupSelect={isGroupSelect}
        onAddElement={addElement}
        onStartEdit={startTextEdit}
        onSaveText={saveTextEdit}
        onCancelEdit={() => setEditingText(false)}
        onTempContentChange={setTempContent}
        onBackgroundChange={(color) => updateElement(selectedId!, { backgroundColor: color })}
        onToggleBold={() =>
          updateElement(selectedId!, { fontWeight: selectedElement?.fontWeight === "bold" ? "normal" : "bold" })
        }
        onToggleItalic={() =>
          updateElement(selectedId!, { fontStyle: selectedElement?.fontStyle === "italic" ? "normal" : "italic" })
        }
        onToggleUnderline={() =>
          updateElement(selectedId!, {
            textDecoration: selectedElement?.textDecoration === "underline" ? "none" : "underline",
          })
        }
        onDeleteElement={() => deleteElement(selectedId!)}
        onTransparent={() => updateElement(selectedId!, { backgroundColor: "transparent" })}
        onDeleteSelected={deleteSelectedElements}
        onSave={handleSaveResume}
        onShare={handleShareResume}
        onReset={() => {
          setElements(resume.elements)
          setSelectedId(null)
          setSelectedIds([])
          setHasUnsavedChanges(false)
        }}
        onDownloadPDF={handleDownloadPDF}
        onZoomIn={() => setZoom(Math.min(200, zoom + 25))}
        onZoomOut={() => setZoom(Math.max(25, zoom - 25))}
        onToggleGrid={() => setShowGrid(!showGrid)}
        onToggleGroupSelect={() => {
          setIsGroupSelect(!isGroupSelect)
          setSelectedIds([])
        }}
      />

      <ResumeCanvas
        elements={elements}
        selectedId={selectedId}
        selectedIds={selectedIds}
        isDragging={isDragging}
        draggingId={draggingId}
        zoom={zoom}
        showGrid={showGrid}
        resumeRef={resumeRef}
        resumeBackground={resumeData.background}
        onElementClick={handleElementClick}
        onMouseDown={handleMouseDown}
        onDoubleClick={(e, id, el) => {
          e.stopPropagation()
          setTempContent(el.content)
          startTextEdit()
        }}
        renderElement={renderElement}
        onCanvasClick={() => {
          setSelectedId(null)
          setSelectedIds([])
        }}
        selectedElement={selectedElement}
        isGroupSelect={isGroupSelect}
      />

      {showShareModal && <ShareModal shareLink={shareLink} onClose={() => setShowShareModal(false)} />}
    </div>
  )
}

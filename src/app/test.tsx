"use client";
import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { toPng } from 'html-to-image';
import jsPDF from "jspdf";
import { 
  ZoomIn, ZoomOut, Grid3x3, Download, RotateCcw, Bold, Italic, 
  Trash2, Plus, Type, Square, AlignLeft, AlignCenter, AlignRight, 
  Underline, Save, Share2, Heading, List, Pilcrow 
} from "lucide-react";

// Types
type ResumeElement = {
  id: string;
  type: "heading" | "text" | "section" | "paragraph" | "list";
  content: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textAlign?: string;
  color?: string;
  backgroundColor?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  lineHeight?: number;
  children?: ResumeElement[];
  listType?: "bullet" | "number";
};

type ResumeJSON = {
  background: string;
  layout: string;
  elements: ResumeElement[];
};

interface Props {
  resume: ResumeJSON;
  onSave?: (resume: ResumeJSON) => void;
}

export const EditableResume: React.FC<Props> = ({ resume, onSave }) => {
  const resumeRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [resumeData, setResumeData] = useState<ResumeJSON>(resume);
  const [elements, setElements] = useState(resume.elements);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [isGroupSelect, setIsGroupSelect] = useState(false);
  const [editingText, setEditingText] = useState(false);
  const [tempContent, setTempContent] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");

  // Update elements and mark as changed
  const updateElements = (newElements: ResumeElement[]) => {
    setElements(newElements);
    setHasUnsavedChanges(true);
  };

  const updateElement = (id: string, props: Partial<ResumeElement>) => {
    const updateRecursive = (els: ResumeElement[]): ResumeElement[] =>
      els.map(el => {
        if (el.id === id) return { ...el, ...props };
        if (el.children) {
          return { ...el, children: updateRecursive(el.children) };
        }
        return el;
      });
    const updatedElements = updateRecursive(elements);
    updateElements(updatedElements);
  };

  const deleteElement = (id: string) => {
    const deleteRecursive = (els: ResumeElement[]): ResumeElement[] =>
      els.filter(el => {
        if (el.id === id) return false;
        if (el.children) {
          el.children = deleteRecursive(el.children);
        }
        return true;
      });
    const updatedElements = deleteRecursive(elements);
    updateElements(updatedElements);
    setSelectedId(null);
  };

  const deleteSelectedElements = () => {
    if (selectedIds.length === 0) return;
    let updatedElements = elements;
    selectedIds.forEach(id => {
      updatedElements = updatedElements.filter(el => el.id !== id);
    });
    updateElements(updatedElements);
    setSelectedIds([]);
    setSelectedId(null);
  };

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
      lineHeight: 1.4
    };

    const elementConfigs = {
      text: { content: "Double click to edit text", width: 300, height: 40 },
      heading: { content: "Heading", fontSize: 24, fontWeight: "bold", width: 300, height: 50 },
      paragraph: { content: "Lorem ipsum dolor sit amet...", width: 400, height: 80 },
      list: { content: "Item 1\nItem 2\nItem 3", listType: "bullet" as const, width: 300, height: 80 },
      section: { content: "", backgroundColor: "#f0f0f0", width: 200, height: 100, children: [] }
    };

    const newElement: ResumeElement = {
      ...baseElement,
      ...elementConfigs[type],
      id: `${type}_${Date.now()}`
    };

    const updatedElements = [...elements, newElement];
    updateElements(updatedElements);
    setSelectedId(newElement.id);
  };

  const handleElementClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    if (isGroupSelect && e.shiftKey) {
      setSelectedIds(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } else {
      setSelectedId(id);
      setSelectedIds([]);
      const element = findElementById(elements, id);
      if (element) {
        setTempContent(element.content);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    if (e.detail === 2) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDraggingId(id);
    
    if (!isGroupSelect) {
      setSelectedId(id);
    }
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    const elementsToMove = isGroupSelect && selectedIds.includes(id) 
      ? selectedIds.map(sid => findElementById(elements, sid)).filter(Boolean) as ResumeElement[]
      : [findElementById(elements, id)].filter(Boolean) as ResumeElement[];

    const startPositions = elementsToMove.map(el => ({ id: el.id, x: el.x, y: el.y }));

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startX) / (zoom / 100);
      const deltaY = (moveEvent.clientY - startY) / (zoom / 100);
      
      startPositions.forEach(({ id, x, y }) => {
        const element = findElementById(elements, id);
        if (!element) return;
        
        const newX = Math.max(0, Math.min(800 - element.width, x + deltaX));
        const newY = Math.max(0, Math.min(1200 - element.height, y + deltaY));
        
        updateElement(id, { x: newX, y: newY });
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDraggingId(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const findElementById = (els: ResumeElement[], id: string): ResumeElement | null => {
    for (const el of els) {
      if (el.id === id) return el;
      if (el.children) {
        const found = findElementById(el.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedElement = selectedId ? findElementById(elements, selectedId) : null;

  const startTextEdit = () => {
    if (selectedElement) {
      setEditingText(true);
      setTempContent(selectedElement.content);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const saveTextEdit = () => {
    if (selectedId) {
      updateElement(selectedId, { content: tempContent });
      setEditingText(false);
    }
  };

  // Save resume data
  const handleSaveResume = () => {
    const updatedResume: ResumeJSON = {
      ...resumeData,
      elements: elements
    };
    
    setResumeData(updatedResume);
    setHasUnsavedChanges(false);
    
    if (onSave) {
      onSave(updatedResume);
    }
    
    // Show success message
  };

  // Share resume functionality
  const handleShareResume = async () => {
    try {
      const resumeDataToShare = {
        ...resumeData,
        elements: elements
      };
      
      // Create a shareable link (in a real app, this would be an API call)
      const shareData = btoa(JSON.stringify(resumeDataToShare));
      console.log(shareData);
      
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/resume/share?data=${shareData}`;
      
      setShareLink(shareUrl);
      setShowShareModal(true);
      
      // Copy to clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        alert("Share link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing resume:", error);
      alert("Error generating share link");
    }
  };

  // Format text for different element types
  const formatTextContent = (element: ResumeElement) => {
    if (element.type === "list") {
      const items = element.content.split('\n').filter(item => item.trim());
      return (
        <div>
          {items.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 4 }}>
              <span style={{ marginRight: 8 }}>
                {element.listType === "number" ? `${index + 1}.` : "•"}
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      );
    }
    
    if (element.type === "heading") {
      return <h1 style={{ margin: 0, fontSize: element.fontSize }}>{element.content}</h1>;
    }
    
    if (element.type === "paragraph") {
      return <p style={{ margin: 0, fontSize: element.fontSize }}>{element.content}</p>;
    }
    
    return element.content;
  };

  const renderElement = (el: ResumeElement) => {
    const isSelected = selectedId === el.id || selectedIds.includes(el.id);
    const style: React.CSSProperties = {
      position: 'absolute',
      left: el.x,
      top: el.y,
      width: el.width,
      minHeight: el.height,
      fontSize: el.fontSize,
      fontFamily: el.fontFamily,
      fontWeight: el.fontWeight,
      fontStyle: el.fontStyle,
      textDecoration: el.textDecoration,
      textAlign: el.textAlign as any,
      color: el.color,
      backgroundColor: el.backgroundColor === 'transparent' ? undefined : el.backgroundColor,
      lineHeight: el.lineHeight,
      margin: 0,
      padding: '8px 12px',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      overflow: 'visible',
      cursor: isDragging && draggingId === el.id ? 'grabbing' : 'move',
      border: isSelected ? '2px solid #3b82f6' : '1px solid transparent',
      userSelect: 'none',
      borderRadius: '4px',
      transition: 'border 0.15s ease',
      boxSizing: 'border-box',
    };

    if (el.type === "section") {
      return (
        <div
          key={el.id}
          style={style}
          onClick={(e) => handleElementClick(e, el.id)}
          onMouseDown={(e) => handleMouseDown(e, el.id)}
          onDoubleClick={(e) => {
            e.stopPropagation();
            const newContent = prompt("Edit section content:", el.content);
            if (newContent !== null) updateElement(el.id, { content: newContent });
          }}
          onMouseEnter={(e) => {
            if (!isSelected && !isDragging) {
              e.currentTarget.style.border = '1px dashed #94a3b8';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.border = '1px solid transparent';
            }
          }}
        >
          {el.children && el.children.map(child => renderElement(child))}
        </div>
      );
    }

    return (
      <div
        key={el.id}
        style={style}
        onClick={(e) => handleElementClick(e, el.id)}
        onMouseDown={(e) => handleMouseDown(e, el.id)}
        onDoubleClick={(e) => {
          e.stopPropagation();
          startTextEdit();
        }}
        onMouseEnter={(e) => {
          if (!isSelected && !isDragging) {
            e.currentTarget.style.border = '1px dashed #94a3b8';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.border = '1px solid transparent';
          }
        }}
      >
        {formatTextContent(el)}
      </div>
    );
  };

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;

    try {
      const originalBg = resumeRef.current.style.background;
      resumeRef.current.style.background = 'white';

      // Hide borders temporarily
      const allElements = resumeRef.current.querySelectorAll('*');
      const originalStyles: Array<{ border: string; outline: string; boxShadow: string }> = [];

      allElements.forEach((el: HTMLElement) => {
        originalStyles.push({
          border: el.style.border,
          outline: el.style.outline,
          boxShadow: el.style.boxShadow,
        });
        el.style.border = 'none';
        el.style.outline = 'none';
        el.style.boxShadow = 'none';
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      // High-res capture
      const pixelRatio = 3;
      const dataUrl = await toPng(resumeRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio,
      });

      // Restore styles
      resumeRef.current.style.background = originalBg;
      allElements.forEach((el, index) => {
        el.style.border = originalStyles[index].border;
        el.style.outline = originalStyles[index].outline;
        el.style.boxShadow = originalStyles[index].boxShadow;
      });

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Load the image to get dimensions
      const img = new Image();
      img.src = dataUrl;
      await new Promise(resolve => (img.onload = resolve));

      const imgWidthMm = (img.width * 25.4) / 96;
      const imgHeightMm = (img.height * 25.4) / 96;

      // Calculate correct aspect ratio and centering
      const scale = Math.min(pdfWidth / imgWidthMm, pdfHeight / imgHeightMm);

      // Fill full width exactly
      const displayWidth = pdfWidth + 0.2;
      const displayHeight = imgHeightMm * (displayWidth / imgWidthMm);

      const offsetY = (pdfHeight - displayHeight) / 2;

      pdf.addImage(
        dataUrl,
        'PNG',
        0,
        offsetY,
        displayWidth,
        displayHeight,
        undefined,
        'FAST'
      );

      pdf.save('resume.pdf');
      console.log('✅ Perfectly fitted PDF exported!');
    } catch (error) {
      console.error('PDF generation error:', error);
      alert(
        `PDF export failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }. Please try again or refresh the page.`
      );
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      background: 'linear-gradient(to br, #f8fafc, #e2e8f0)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Left Sidebar */}
      <div style={{ 
        width: 320, 
        background: 'white', 
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
        overflowY: 'auto'
      }}>
        <div style={{ padding: 20, borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1e293b' }}>Resume Editor</h2>
          <p style={{ margin: '8px 0 0 0', fontSize: 13, color: '#64748b' }}>Professional Design Tool</p>
          
          {/* Save Indicator */}
          {hasUnsavedChanges && (
            <div style={{
              marginTop: 8,
              padding: '6px 12px',
              background: '#fef3c7',
              borderRadius: 4,
              fontSize: 12,
              color: '#92400e',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              <div style={{ width: 8, height: 8, background: '#f59e0b', borderRadius: '50%' }}></div>
              Unsaved changes
            </div>
          )}
        </div>

        {/* Tools */}
        <div style={{ padding: 20, flex: 1 }}>
          {/* Add Elements */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Add Elements</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
              <button
                onClick={() => addElement("text")}
                style={{
                  padding: '10px 12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#475569',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#eff6ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
              >
                <Type size={16} />
                Text
              </button>
              <button
                onClick={() => addElement("heading")}
                style={{
                  padding: '10px 12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#475569',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#eff6ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
              >
                <Heading size={16} />
                Heading
              </button>
              <button
                onClick={() => addElement("paragraph")}
                style={{
                  padding: '10px 12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#475569',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#eff6ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
              >
                <Pilcrow size={16} />
                Paragraph
              </button>
              <button
                onClick={() => addElement("list")}
                style={{
                  padding: '10px 12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#475569',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#eff6ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
              >
                <List size={16} />
                List
              </button>
              <button
                onClick={() => addElement("section")}
                style={{
                  gridColumn: '1 / -1',
                  padding: '10px 12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#475569',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#eff6ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
              >
                <Square size={16} />
                Section Box
              </button>
            </div>
          </div>

          {/* List Type Selector */}
          {selectedElement && selectedElement.type === "list" && (
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>List Type</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => updateElement(selectedId!, { listType: "bullet" })}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: selectedElement.listType === "bullet" ? '#3b82f6' : '#f8fafc',
                    color: selectedElement.listType === "bullet" ? 'white' : '#475569',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 500
                  }}
                >
                  Bullet
                </button>
                <button
                  onClick={() => updateElement(selectedId!, { listType: "number" })}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: selectedElement.listType === "number" ? '#3b82f6' : '#f8fafc',
                    color: selectedElement.listType === "number" ? 'white' : '#475569',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 500
                  }}
                >
                  Numbered
                </button>
              </div>
            </div>
          )}

          {/* View Controls */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>View Controls</h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <button
                onClick={() => setZoom(Math.max(25, zoom - 25))}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#475569',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
              >
                <ZoomOut size={16} />
              </button>
              <div style={{ 
                flex: 1, 
                padding: '10px', 
                background: '#f8fafc', 
                border: '1px solid #e2e8f0', 
                borderRadius: 6,
                textAlign: 'center',
                fontSize: 13,
                fontWeight: 600,
                color: '#1e293b'
              }}>
                {zoom}%
              </div>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#475569',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
              >
                <ZoomIn size={16} />
              </button>
            </div>
            <button
              onClick={() => setShowGrid(!showGrid)}
              style={{
                width: '100%',
                padding: '10px 16px',
                background: showGrid ? '#3b82f6' : '#f8fafc',
                color: showGrid ? 'white' : '#475569',
                border: showGrid ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 8,
                transition: 'all 0.2s'
              }}
            >
              <Grid3x3 size={16} />
              {showGrid ? 'Hide Grid' : 'Show Grid'}
            </button>
            <button
              onClick={() => {
                setIsGroupSelect(!isGroupSelect);
                setSelectedIds([]);
              }}
              style={{
                width: '100%',
                padding: '10px 16px',
                background: isGroupSelect ? '#8b5cf6' : '#f8fafc',
                color: isGroupSelect ? 'white' : '#475569',
                border: isGroupSelect ? '1px solid #8b5cf6' : '1px solid #e2e8f0',
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: 13,
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              <Plus size={16} />
              {isGroupSelect ? 'Group Select ON' : 'Group Select'}
            </button>
            {selectedIds.length > 0 && (
              <div style={{ marginTop: 8, padding: 8, background: '#f0f9ff', borderRadius: 6, fontSize: 12, color: '#0369a1', textAlign: 'center', fontWeight: 500 }}>
                {selectedIds.length} elements selected
              </div>
            )}
          </div>

          {/* Text Editor */}
          {selectedElement && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {editingText ? 'Text Editor' : 'Element Properties'}
              </h3>
              
              {editingText ? (
                <div>
                  <textarea
                    ref={textareaRef}
                    value={tempContent}
                    onChange={(e) => setTempContent(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: 120,
                      padding: '10px',
                      border: '1px solid #e2e8f0',
                      borderRadius: 6,
                      fontSize: 13,
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      marginBottom: 8,
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={saveTextEdit}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 500
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingText(false)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        background: '#f8fafc',
                        color: '#475569',
                        border: '1px solid #e2e8f0',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 500
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={startTextEdit}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#eff6ff',
                      color: '#3b82f6',
                      border: '1px solid #dbeafe',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 500,
                      marginBottom: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                  >
                    <Type size={16} />
                    Open Text Editor
                  </button>
                </>
              )}
              
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#64748b', marginBottom: 6 }}>Background</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="color"
                    value={selectedElement.backgroundColor === 'transparent' ? '#ffffff' : selectedElement.backgroundColor || '#ffffff'}
                    onChange={(e) => updateElement(selectedId!, { backgroundColor: e.target.value })}
                    style={{
                      width: 50,
                      height: 40,
                      border: '1px solid #e2e8f0',
                      borderRadius: 6,
                      cursor: 'pointer'
                    }}
                  />
                  <button
                    onClick={() => updateElement(selectedId!, { backgroundColor: 'transparent' })}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: 6,
                      fontSize: 12,
                      background: selectedElement.backgroundColor === 'transparent' ? '#3b82f6' : 'white',
                      color: selectedElement.backgroundColor === 'transparent' ? 'white' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    Transparent
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button
                  onClick={() => updateElement(selectedId!, { fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold' })}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: selectedElement.fontWeight === 'bold' ? '#3b82f6' : '#f8fafc',
                    color: selectedElement.fontWeight === 'bold' ? 'white' : '#475569',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Bold size={16} />
                </button>
                <button
                  onClick={() => updateElement(selectedId!, { fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic' })}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: selectedElement.fontStyle === 'italic' ? '#3b82f6' : '#f8fafc',
                    color: selectedElement.fontStyle === 'italic' ? 'white' : '#475569',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Italic size={16} />
                </button>
                <button
                  onClick={() => updateElement(selectedId!, { textDecoration: selectedElement.textDecoration === 'underline' ? 'none' : 'underline' })}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: selectedElement.textDecoration === 'underline' ? '#3b82f6' : '#f8fafc',
                    color: selectedElement.textDecoration === 'underline' ? 'white' : '#475569',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Underline size={16} />
                </button>
              </div>

              <button
                onClick={() => deleteElement(selectedId!)}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: '#fee2e2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
              >
                <Trash2 size={16} />
                Delete Element
              </button>
            </div>
          )}

          {/* Group Actions */}
          {selectedIds.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Group Actions</h3>
              <button
                onClick={deleteSelectedElements}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: '#fee2e2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
              >
                <Trash2 size={16} />
                Delete {selectedIds.length} Elements
              </button>
            </div>
          )}

          {/* Actions */}
          <div>
            <h3 style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</h3>
            
            <button
              onClick={handleSaveResume}
              disabled={!hasUnsavedChanges}
              style={{
                width: '100%',
                padding: '10px 16px',
                background: hasUnsavedChanges ? '#10b981' : '#d1fae5',
                color: hasUnsavedChanges ? 'white' : '#065f46',
                border: 'none',
                borderRadius: 6,
                cursor: hasUnsavedChanges ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 12,
                transition: 'all 0.2s',
                opacity: hasUnsavedChanges ? 1 : 0.7
              }}
            >
              <Save size={16} />
              Save Resume
            </button>

            <button
              onClick={handleShareResume}
              style={{
                width: '100%',
                padding: '10px 16px',
                background: '#f8fafc',
                color: '#475569',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 12,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
            >
              <Share2 size={16} />
              Share CV
            </button>

            <button
              onClick={() => {
                setElements(resume.elements);
                setSelectedId(null);
                setSelectedIds([]);
                setHasUnsavedChanges(false);
              }}
              style={{
                width: '100%',
                padding: '10px 16px',
                background: '#f8fafc',
                color: '#475569',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 12,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
            >
              <RotateCcw size={16} />
              Reset All Changes
            </button>
            
            <button
              onClick={handleDownloadPDF}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: 14,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
              }}
            >
              <Download size={18} />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Top Toolbar */}
        <div style={{ 
          background: 'white', 
          borderBottom: '1px solid #e2e8f0',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {selectedElement ? (
              <>
                <div style={{ 
                  padding: '6px 12px', 
                  background: '#eff6ff', 
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#3b82f6'
                }}>
                  {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)}
                </div>
                <span style={{ fontSize: 13, color: '#64748b' }}>
                  Selected
                </span>
              </>
            ) : selectedIds.length > 0 ? (
              <>
                <div style={{ 
                  padding: '6px 12px', 
                  background: '#f3e8ff', 
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#8b5cf6'
                }}>
                  Group
                </div>
                <span style={{ fontSize: 13, color: '#64748b' }}>
                  {selectedIds.length} elements selected
                </span>
              </>
            ) : (
              <span style={{ fontSize: 13, color: '#94a3b8' }}>
                Click any element to select • Shift+Click for group select
              </span>
            )}
          </div>
          <div style={{ 
            padding: '8px 16px',
            background: '#fef3c7',
            borderRadius: 6,
            fontSize: 12, 
            color: '#92400e', 
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            💡 Single click = select • Double click = edit • Drag = move
          </div>
        </div>

        {/* Canvas Area */}
        <div style={{ 
          flex: 1, 
          overflow: 'auto', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'flex-start',
          padding: 40,
          background: showGrid ? 
            'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)' : 
            'transparent',
          backgroundSize: showGrid ? '20px 20px' : 'auto'
        }}
        onClick={() => {
          setSelectedId(null);
          setSelectedIds([]);
        }}
        >
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease',
            }}
          >
            <div
              style={{
                display: "inline-block",
                position: "relative",
                background: resume.background,
                border: "1px solid #cbd5e1",
                width: 800,
                minHeight: 1200,
                overflow: "visible",
                boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
                borderRadius: 8
              }}
              ref={resumeRef}
            >
              {elements.map(el => renderElement(el))}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: 24,
            borderRadius: 12,
            width: 500,
            maxWidth: '90vw',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600, color: '#1e293b' }}>
              Share Your Resume
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: 14, color: '#64748b' }}>
              Copy the link below to share your resume with others:
            </p>
            <div style={{
              display: 'flex',
              gap: 8,
              marginBottom: 20
            }}>
              <input
                type="text"
                value={shareLink}
                readOnly
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  fontSize: 14,
                  background: '#f8fafc'
                }}
              />
              <button
                onClick={() => navigator.clipboard.writeText(shareLink)}
                style={{
                  padding: '10px 16px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500
                }}
              >
                Copy
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowShareModal(false)}
                style={{
                  padding: '10px 20px',
                  background: '#f8fafc',
                  color: '#475569',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
"use client"
import type React from "react"

interface ShareModalProps {
  shareLink: string
  onClose: () => void
}

export const ShareModal: React.FC<ShareModalProps> = ({ shareLink, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          padding: 24,
          borderRadius: 12,
          width: 500,
          maxWidth: "90vw",
          boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 600, color: "#1e293b" }}>Share Your Resume</h3>
        <p style={{ margin: "0 0 20px 0", fontSize: 14, color: "#64748b" }}>
          Copy the link below to share your resume with others:
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <input
            type="text"
            value={shareLink}
            readOnly
            style={{
              flex: 1,
              padding: "10px 12px",
              border: "1px solid #e2e8f0",
              borderRadius: 6,
              fontSize: 14,
              background: "#f8fafc",
            }}
          />
          <button
            onClick={() => navigator.clipboard.writeText(shareLink)}
            style={{
              padding: "10px 16px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Copy
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              background: "#f8fafc",
              color: "#475569",
              border: "1px solid #e2e8f0",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

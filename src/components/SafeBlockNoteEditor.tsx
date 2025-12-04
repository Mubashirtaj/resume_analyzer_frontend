"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import the entire BlockNote editor with SSR disabled
const BlockNoteEditor = dynamic(
  () =>
    import("@blocknote/react").then((mod) => {
      const { BlockNoteViewRaw, useCreateBlockNote } = mod;
      
      const EditorComponent = ({ initialContent }: { initialContent?: string }) => {
        const editor = useCreateBlockNote();
        
        useEffect(() => {
          if (initialContent) {
            try {
              editor.replaceBlocks(editor.document, [
                { type: "paragraph", content: initialContent },
              ]);
            } catch (error) {
              console.error("Error setting initial content:", error);
            }
          }
        }, [initialContent, editor]);

        return <BlockNoteViewRaw editor={editor} />;
      };
      
      return EditorComponent;
    }),
  { 
    ssr: false,
    loading: () => <div className="p-4">Loading editor...</div>
  }
);

export default function SafeBlockNoteEditor({ initialContent }: { initialContent?: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded">
        <p className="text-red-600">Failed to load editor. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <div onError={() => setHasError(true)}>
      <BlockNoteEditor initialContent={initialContent} />
    </div>
  );
}
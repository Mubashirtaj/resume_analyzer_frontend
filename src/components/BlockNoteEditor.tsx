"use client";
import { useState, useEffect } from "react";
import { BlockNoteViewRaw, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";

interface BlockNoteEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
}

export default function BlockNoteEditor({ 
  initialContent, 
  onContentChange 
}: BlockNoteEditorProps) {
  const editor = useCreateBloc  kNote();

  useEffect(() => {
    if (initialContent) {
      editor.replaceBlocks(editor.document, [
        { type: "paragraph", content: initialContent },
      ]);
    }
  }, [initialContent, editor]);

  return <BlockNoteViewRaw editor={editor} />;
}
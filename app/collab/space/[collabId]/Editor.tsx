import React, { useEffect, useRef, useState } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { registerCompletion } from "monacopilot";

export default function CodeEditor({
  value,
  onChange,
  lang,
}: {
  value: string;
  onChange: any;
  lang: string;
}) {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;

    registerCompletion(monaco, editor, {
      endpoint: "http://localhost:4000/complete",
      language: lang,
    });
  }

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      registerCompletion(monacoRef.current, editorRef.current, {
        endpoint: "http://localhost:4000/complete",
        language: lang,
      });
    }
  }, [lang]);

  return (
    <div className="md:h-[90vh] md:w-[75%] h-[60vh] md:border-blue-400 border-2">
      <Editor
        language={lang}
        theme="vs-dark"
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}
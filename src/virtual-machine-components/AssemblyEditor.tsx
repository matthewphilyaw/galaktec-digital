import React from "react";
import Editor from '@monaco-editor/react';

export default function AssemblyEditor(props: { initialProgram: string, onChange: (value: string | undefined) => void}) {
  const { initialProgram, onChange } = props;

  return (
    <Editor
      theme="vs-dark"
      defaultValue={initialProgram}
      defaultLanguage="mips"
      onChange={onChange}
    />
  );
}
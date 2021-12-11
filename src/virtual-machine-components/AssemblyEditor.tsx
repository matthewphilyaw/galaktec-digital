import React from "react";
import Editor from '@monaco-editor/react';
import Panel from '../layout/Panel';
import styles from './AssemblyEditor.module.css';

export default function AssemblyEditor(props: { initialProgram: string, onChange: (value: string | undefined) => void}) {
  const { initialProgram, onChange } = props;

  return (
    <div className={styles.AssemblyEditor}>
      <Panel>
        <Editor
          theme="vs-dark"
          defaultValue={initialProgram}
          defaultLanguage="mips"
          height={"100%"}
          onChange={onChange}
          options={{
            codeLens: false,
            minimap: {
              enabled: false
            }
          }}
        />
      </Panel>
    </div>
  );
}
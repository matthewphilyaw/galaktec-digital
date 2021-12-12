import React from "react";
import Editor from '@monaco-editor/react';
import Panel from '../layout/Panel';
import styles from './AssemblyEditor.module.css';

export default function AssemblyEditor(props: { initialProgram: string, onChange: (value: string | undefined) => void}) {
  const { initialProgram, onChange } = props;

  const header =  (
    <div className={styles['editor-panel-header']}>
      <h3 className={"reset-margin"}>Editor</h3>
    </div>
  );

  return (
    <div className={styles.AssemblyEditor}>
      <Panel headerContent={header}>
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
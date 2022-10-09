import React, { useEffect, useRef } from 'react';
import { useCodeMirror } from '@uiw/react-codemirror';
import styles from './CodeEditor.module.css';
import {AssemblySetup} from './code-mirror-setup';
import {AssemblyTheme} from './code-mirror-theme';

export interface CodeEditorProps {
  initialProgram: string;
  onChange: (value: string | undefined) => void;
}

export default function CodeEditor(props: CodeEditorProps) {
  const { initialProgram, onChange} = props;

  const editor = useRef<HTMLDivElement>(null);
  const { setContainer, state } = useCodeMirror({
    container: editor.current,
    value: initialProgram,
    basicSetup: false,
    theme: AssemblyTheme,
    extensions: [
      AssemblySetup,
    ],
    onChange: (value) => { onChange(value); }
  });

  useEffect(() => {
    if (editor.current) {
      setContainer(editor.current);
    }
  }, [editor.current]);

  return (
    <div className={styles.container}>
       <div className={styles.editor} ref={editor} />
    </div>
  );
}
import React, { useEffect, useRef } from 'react';
import { useCodeMirror } from '@uiw/react-codemirror';
import styles from './AssemblyEditorCM.module.css';
import {PanelHeader} from '../../layout/PanelHeader';
import Panel from '../../layout/Panel';
import {AssemblySetup} from './code-mirror-setup';
import {AssemblyTheme} from './code-mirror-theme';

export interface AssemblyEditorCMProps {
  initialProgram: string;
  onChange: (value: string | undefined) => void;
}

export default function AssemblyEditorCM(props: AssemblyEditorCMProps) {
  const { initialProgram, onChange } = props;

  const editor = useRef<HTMLDivElement>(null);
  const { setContainer } = useCodeMirror({
    container: editor.current,
    value: initialProgram,
    basicSetup: false,
    theme: AssemblyTheme,
    extensions: [AssemblySetup],
    onChange: (value) => { onChange(value); }
  });

  useEffect(() => {
    if (editor.current) {
      setContainer(editor.current);
    }
  }, [editor.current]);

  return (
    <div className={styles.AssemblyEditor}>
      <Panel headerContent={<PanelHeader text={'Program'} />}>
        <div className={styles.AssemblyEditorCM} ref={editor} />
      </Panel>
    </div>
  );
}
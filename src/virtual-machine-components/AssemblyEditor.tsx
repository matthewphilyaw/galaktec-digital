import React, {useEffect} from 'react';
import Editor, {useMonaco} from '@monaco-editor/react';
import Panel from '../layout/Panel';
import styles from './AssemblyEditor.module.css';

export default function AssemblyEditor(props: { initialProgram: string, onChange: (value: string | undefined) => void}) {
  const { initialProgram, onChange } = props;

  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('myCustomTheme', {
        base: 'vs-dark', // can also be vs-dark or hc-black
        inherit: true, // can also be false to completely replace the builtin rules
        rules: [
          { token: '', background: '040A10'},
          {
            "foreground": "#7EAFDD",
            "background": "#040A10",
            "token": "text source"
          },
          {
            "foreground": "#7EAFDD",
            "background": "#040A10",
            "token": "string.unquoted.heredoc"
          },
          {
            "foreground": "#7EAFDD",
            "background": "#040A10",
            "token": "source source"
          },
        ] ,
        colors: {
          'editor.foreground': '#7EAFDD',
          'editor.background': '#040A10',
          'editorCursor.foreground': '#7EAFDD',
          'editor.lineHighlightBackground': '#040A10',
          'editorLineNumber.foreground': '#7EAFDD',
          'editor.selectionBackground': '#7EAFDD',
          'editor.inactiveSelectionBackground': '#7EAFDD'
        }
      });

      monaco.editor.setTheme('myCustomTheme');
    }
  }, [monaco]);

  const header =  (
    <div className={styles['editor-panel-header']}>
      <h4 className={"reset-margin"}>Program</h4>
    </div>
  );

  return (
    <div className={styles.AssemblyEditor}>
      <Panel headerContent={header} size={'u3'}>
        <Editor
          defaultValue={initialProgram}
          defaultLanguage={'text/plain'}
          height={'100%'}
          onChange={onChange}
          options={{
            codeLens: false,
            minimap: {
              enabled: false
            },
          }}
        />
      </Panel>
    </div>
  );
}
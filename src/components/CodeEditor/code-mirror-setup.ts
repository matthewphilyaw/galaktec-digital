import {drawSelection, keymap, lineNumbers} from '@codemirror/view';
import {Extension} from '@codemirror/state';
import {defaultKeymap, history, historyKeymap} from '@codemirror/commands';
import {indentUnit, StreamLanguage, syntaxHighlighting} from '@codemirror/language';
import {assemblyHighlightStyle} from './code-mirror-theme';
import {gas} from './stream-parser-gas';

export const AssemblySetup: Extension = [
  lineNumbers(),
  history(),
  drawSelection(),
  StreamLanguage.define(gas),
  indentUnit.of('    '),
  syntaxHighlighting(assemblyHighlightStyle),
  keymap.of([
    ...defaultKeymap,
    ...historyKeymap,
  ])
]
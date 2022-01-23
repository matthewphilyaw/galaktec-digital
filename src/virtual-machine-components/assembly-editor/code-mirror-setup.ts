import {keymap, drawSelection, dropCursor} from '@codemirror/view';
import {Extension} from '@codemirror/state';
import {history, historyKeymap} from '@codemirror/history';
import {lineNumbers} from '@codemirror/gutter';
import {defaultKeymap} from '@codemirror/commands';
import {defaultHighlightStyle} from '@codemirror/highlight';

export const AssemblySetup: Extension = [
  lineNumbers(),
  history(),
  drawSelection(),
  defaultHighlightStyle.fallback,
  keymap.of([
    ...defaultKeymap,
    ...historyKeymap,
  ])
]
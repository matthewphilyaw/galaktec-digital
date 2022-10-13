import {EditorView} from '@codemirror/view';
import {HighlightStyle} from '@codemirror/language';
import {colorsInHex, MonakaiTheme} from '../../theme/theme';
import {tags} from '@lezer/highlight';

const primaryColorHex = colorsInHex.primaryColor.value;
const backgroundColorHex = colorsInHex.accentColor.value;

export const AssemblyTheme = EditorView.theme(
  {
    '&': {
      height: '100%',
      width: '100%',
      background: 'transparent',
      fontSize: '12pt'
    },
    '.cm-gutters': {
      background: backgroundColorHex,
      color: colorsInHex.primaryColor.value,
      boxShadow: '0 0 5px 2px black',
      fontFamily: "'Roboto Mono', monospace",
      fontWeight: '500'
    },
    '.cm-gutter.cm-lineNumbers': {
      minWidth: '5ch'
    },
    '.cm-content': {
      fontFamily: "'Roboto Mono', monospace",
      fontWeight: '300'
    },

    '&.cm-focused .cm-cursor': {
      borderLeftColor: primaryColorHex,
    },
    '.cm-scroller': {overflow: 'auto'},

    '&.cm-focused .cm-selectionBackground, ::selection': {
      background: colorsInHex.codeEditorSelectionActive.value,
    },
    '.cm-selectionBackground, ::selection': {
      background: colorsInHex.codeEditorSelectionInActive.value,
    },
  },
  {
    dark: true
  }
)

export const assemblyHighlightStyle = HighlightStyle.define([
  {tag: tags.comment, color: MonakaiTheme.comments},
  {tag: tags.literal, color: MonakaiTheme.purple},
  {tag: tags.standard(tags.variableName), color: MonakaiTheme.green},
  {tag: tags.keyword, color: MonakaiTheme.blue},
  {tag: tags.operator, color: MonakaiTheme.pink},
  {tag: tags.bracket, color: MonakaiTheme.white},
  {tag: tags.special(tags.variableName), color: MonakaiTheme.green},
  {tag: tags.variableName, color: MonakaiTheme.yellow},
  {tag: tags.labelName, color: MonakaiTheme.orange}
]);
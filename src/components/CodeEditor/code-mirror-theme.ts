import {EditorView} from '@codemirror/view';
import {HighlightStyle} from '@codemirror/language';
import {colors, MonakaiTheme} from '../../theme/theme';
import {tags} from '@lezer/highlight';

export const AssemblyTheme = EditorView.theme(
  {
    '&': {
      height: '100%',
      width: '100%',
      background: 'transparent',
      fontSize: 'smaller'
    },
    '.cm-gutters': {
      background: 'transparent',
      color: colors.primaryColor.value,
      fontFamily: "'Roboto Mono', monospace",
      fontWeight: '500'
    },
    '.cm-gutter.cm-lineNumbers': {
      minWidth: '5ch'
    },
    '.cm-content': {
      fontFamily: "'Roboto Mono', monospace",
      fontWeight: '500'
    },
    '&.cm-focused .cm-cursor': {
      borderLeftColor: colors.primaryColorLight.value,
    },
    '.cm-scroller': {overflow: 'auto'},

    '&.cm-focused .cm-selectionBackground, ::selection': {
      background: colors.codeEditorSelectionActive.value,
    },
    '.cm-selectionBackground, ::selection': {
      background: colors.codeEditorSelectionInActive.value,
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
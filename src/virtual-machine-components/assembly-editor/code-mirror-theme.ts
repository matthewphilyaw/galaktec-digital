import {EditorView} from '@codemirror/view';
import {backgroundColorHex, primaryColorDarkHex, primaryColorHex, primaryColorLightHex} from '../../theme';
import {tags, HighlightStyle} from "@codemirror/highlight"

export const AssemblyTheme = EditorView.theme(
  {
    '&': {
      height: '60ch',
      color: primaryColorLightHex,
      background: backgroundColorHex,
      fontSize: '12pt'
    },
    '.cm-gutters': {
      background: backgroundColorHex,
      color: primaryColorLightHex,
      borderRight: `1px solid ${primaryColorDarkHex}`,
      fontFamily: "'Roboto Mono', monospace",
      fontWeight: '500'
    },
    '.cm-gutter.cm-lineNumbers': {
      minWidth: '5ch'
    },
    '.cm-content': {
      caretColor: primaryColorHex,
      fontFamily: "'Roboto Mono', monospace",
      fontWeight: '500'
    },

    '&.cm-focused .cm-cursor': {
      borderLeftColor: primaryColorHex,
    },

    '&.cm-focused .cm-selectionBackground, ::selection': {
      background: primaryColorHex,
      color: backgroundColorHex
    },
    '.cm-selectionBackground, ::selection': {
      background: primaryColorDarkHex,
      color: backgroundColorHex
    },
  },
  {
    dark: true
  }
)


export const assemblyHighlightStyle = HighlightStyle.define([
  {tag: tags.typeName, color: primaryColorHex},
  {tag: tags.keyword, color: primaryColorLightHex},
  {tag: tags.comment, color: primaryColorDarkHex }
])
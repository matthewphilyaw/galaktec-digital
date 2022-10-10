export const MonakaiTheme = {
  comments: '#797979',
  white: '#d6d6d6',
  blue: '#78DCE8',
  green: '#a9dc76',
  purple: '#AB9DF2',
  pink: '#FF6188',
  yellow: '#FFD866',
  orange: '#FC9867'
};

export interface ThemeColor {
  cssKey: string;
  value: string;
}

export interface ThemeColors {
  primaryColorLight: ThemeColor;
  primaryColor: ThemeColor;
  primaryColorDark: ThemeColor;
  accentColorLight: ThemeColor;
  accentColor: ThemeColor;
  accentColorDark: ThemeColor;
  backgroundColorLight: ThemeColor;
  backgroundColor: ThemeColor;
  backgroundColorDark: ThemeColor;
  alternateBackground: ThemeColor;
  codeEditorBackground: ThemeColor;
  codeEditorSelectionActive: ThemeColor;
  codeEditorSelectionInActive: ThemeColor;
}

export const colorsInHex: ThemeColors = {
  primaryColorLight: {
    cssKey: '--primary-color-light',
    value:'hsl(48, 100%, 60%)'
  },
  primaryColor: {
    cssKey: '--primary-color',
    value:'hsl(48, 100%, 50%)'
  },
  primaryColorDark: {
    cssKey: '--primary-color-dark',
    value:'hsl(48, 100%, 40%)'
  },
  accentColorLight: {
    cssKey: '--accent-color-light',
    value: 'hsl(227, 100%, 30%)'
  },
  accentColor: {
    cssKey: '--accent-color',
    value: 'hsl(227, 100%, 12%)'
  },
  accentColorDark: {
    cssKey: '--accent-color-dark',
    value: 'hsl(227, 100%, 6%)'
  },
  backgroundColorLight: {
    cssKey: '--background-color-light',
    value: 'hsl(0, 0%, 33%)'
  },
  backgroundColor: {
    cssKey: '--background-color',
    value: 'hsl(0, 0%, 23%)'
  },
  backgroundColorDark: {
    cssKey: '--background-color-dark',
    value: 'hsl(0, 0%, 13%)'
  },
  alternateBackground: {
    cssKey: '--alternate-background-color',
    value: 'hsla(0, 0%, 6%, 0.5)'
  },
  codeEditorBackground: {
    cssKey: '--code-editor-background',
    value: 'hsl(0, 0%, 6%)'
  },
  codeEditorSelectionActive: {
    cssKey: '--code-editor-selection-active',
    value: '#3f3f4f'
  },
  codeEditorSelectionInActive: {
    cssKey: '--code-editor-selection-in-active',
    value: '#3a3a3a'
  }
};

export function getListOfThemeColors(): ThemeColor[]  {
  const colors = [];

  let k: keyof ThemeColors;
  for (k in colorsInHex) {
    colors.push(colorsInHex[k]);
  }

  return colors;
}



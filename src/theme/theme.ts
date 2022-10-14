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
  codeEditorSelectionActive: ThemeColor;
  codeEditorSelectionInActive: ThemeColor;
}

export const colors: ThemeColors = {
  primaryColorLight: {
    cssKey: '--primary-color-light',
    value: 'hsl(0 0% 100%)'
  },
  primaryColor: {
    cssKey: '--primary-color',
    value: 'hsl(0 0% 90%)'
  },
  primaryColorDark: {
    cssKey: '--primary-color-dark',
    value: 'hsl(0 0% 75%)'
  },
  accentColorLight: {
    cssKey: '--accent-color-light',
    value: 'hsl(240 100% 10%)'
  },
  accentColor: {
    cssKey: '--accent-color',
    value: 'hsl(240 100% 6%)'
  },
  accentColorDark: {
    cssKey: '--accent-color-dark',
    value: 'hsl(240 100% 6%)'
  },
  backgroundColorLight: {
    cssKey: '--background-color-light',
    value: 'hsl(240 100% 10%)'
  },
  backgroundColor: {
    cssKey: '--background-color',
    value: 'hsl(240 100% 6%)'
  },
  backgroundColorDark: {
    cssKey: '--background-color-dark',
    value: 'hsl(240 100% 3%)'
  },
  codeEditorSelectionActive: {
    cssKey: '--code-editor-selection-active',
    value: 'hsl(240 100% 20%)'
  },
  codeEditorSelectionInActive: {
    cssKey: '--code-editor-selection-in-active',
    value: 'hsl(240 100% 15%)'
  }
};

export function getListOfThemeColors(): ThemeColor[]  {
  const colorsList = [];

  let k: keyof ThemeColors;
  for (k in colors) {
    colorsList.push(colors[k]);
  }

  return colorsList;
}



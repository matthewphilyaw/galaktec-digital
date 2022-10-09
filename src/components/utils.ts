export type LayoutOrientation = 'vertical' | 'horizontal';
export type LayoutPosition = 'top' | 'bottom' | 'left' | 'right';

export interface RandomizeBrightnessMixin {
  randomizeBrightnessPlusOrMinus?: number;
}

export function applyRandomBrightnessToElement(inLine: CSSStyleDeclaration, plusOrMinus: number) {
  const brightness = Math.floor(Math.random() * (plusOrMinus * 2)) - plusOrMinus;
  const brightnessValue = `brightness(${100 + brightness}%)`;

  inLine.setProperty('filter', brightnessValue);
}
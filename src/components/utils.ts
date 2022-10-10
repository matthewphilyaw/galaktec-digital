export type LayoutOrientation = 'vertical' | 'horizontal';
export type LayoutPosition = 'top' | 'bottom' | 'left' | 'right';

export interface RandomizeBrightnessMixin {
  randomizeBrightnessPlusOrMinus?: number;
}

export function createNewBrightnessValue(plusOrMinus?: number) {
  if (!plusOrMinus) {
    return null;
  }

  const brightness = Math.floor(Math.random() * (plusOrMinus * 2)) - plusOrMinus;
  return `brightness(${100 + brightness}%)`;
}
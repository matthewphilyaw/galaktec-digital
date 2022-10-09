import styles from './Screw.module.css';
import {useEffect, useRef} from 'react';
import {applyRandomBrightnessToElement, RandomizeBrightnessMixin} from './utils';

export interface ScrewProps extends RandomizeBrightnessMixin { }

export default function Screw({ randomizeBrightnessPlusOrMinus }: ScrewProps) {
  const screw = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!screw.current || !randomizeBrightnessPlusOrMinus) {
      return;
    }

    const rotation = Math.floor(Math.random() * 360);

    screw.current?.style.setProperty('--screw-rotation-degrees', `${rotation}deg`);

    applyRandomBrightnessToElement(screw.current.style, randomizeBrightnessPlusOrMinus);
  });

  return (
    <div ref={screw} className={styles.screw} />
  )
}
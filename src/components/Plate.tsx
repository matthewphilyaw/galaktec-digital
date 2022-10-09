import styles from './Plate.module.css'
import Screw from './Screw';
import {ReactNode, useEffect, useRef} from 'react';
import {applyRandomBrightnessToElement, LayoutOrientation, RandomizeBrightnessMixin} from './utils';

export interface HeaderPlateProps extends RandomizeBrightnessMixin {
  children?: ReactNode;
  withScrews?: boolean;
  layoutOrientation?: LayoutOrientation;
}

export default function Plate({ children, withScrews = true, layoutOrientation = 'horizontal', randomizeBrightnessPlusOrMinus}: HeaderPlateProps) {
  const plateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (plateRef.current == null || !randomizeBrightnessPlusOrMinus) {
      return;
    }

    applyRandomBrightnessToElement(plateRef.current.style, randomizeBrightnessPlusOrMinus);
  }, [randomizeBrightnessPlusOrMinus])

  return (
    <div ref={plateRef} className={`${styles.plate} ${styles[layoutOrientation]} ${withScrews ? styles.withScrew : ''}`}>
      { withScrews ? <Screw randomizeBrightnessPlusOrMinus={20} /> : null }
      <div className={styles.content}>
        { children }
      </div>
      { withScrews ? <Screw randomizeBrightnessPlusOrMinus={20} /> : null }
    </div>
  )
}
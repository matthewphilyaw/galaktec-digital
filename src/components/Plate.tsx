import styles from './Plate.module.css'
import Screw from './Screw';
import {ReactNode, useEffect, useRef} from 'react';
import {LayoutOrientation} from './utils';

export interface HeaderPlateProps {
  children?: ReactNode;
  withScrews?: boolean;
  layoutOrientation?: LayoutOrientation;
}

export default function Plate({ children, withScrews = true, layoutOrientation = 'horizontal'}: HeaderPlateProps) {
  const plateRef = useRef<HTMLDivElement>(null);

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
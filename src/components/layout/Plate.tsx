import styles from './Plate.module.css';
import {ReactNode, useRef} from 'react';
import {LayoutOrientation} from '../utils';

export interface HeaderPlateProps {
  children?: ReactNode;
  layoutOrientation?: LayoutOrientation;
}

export default function Plate({ children, layoutOrientation = 'horizontal'}: HeaderPlateProps) {
  const plateRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={plateRef} className={`${styles.plate} ${styles[layoutOrientation]}`}>
      <div className={styles.content}>
        { children }
      </div>
    </div>
  )
}
import styles from './Display.module.css';
import {ReactNode} from 'react';

export interface DisplayProps {
  children: ReactNode
}

export default function Display({ children }: DisplayProps) {
  return (
    <div className={styles.display}>
      {children}
    </div>
  );
}
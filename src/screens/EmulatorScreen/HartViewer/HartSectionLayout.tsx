import {ReactNode} from 'react';
import styles from './HartSectionLayout.module.css';
import {H4} from '../../../components/Heading';

export interface HartSectionLayoutProps {
  title: string;
  children: ReactNode;
}

export default function HartSectionLayout({ title, children }: HartSectionLayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <H4 resetStyling={true}>{title}</H4>
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}
import {ReactNode} from 'react';
import styles from './FlexCenteredContent.module.css';

export interface FlexCenteredContentProps {
  children?: ReactNode;
}

export default function FlexCenteredContent({ children }: FlexCenteredContentProps) {
  return <div className={styles.centered}>{children}</div>;
}
import styles from './Widget.module.css';
import React from 'react';
import {H4} from './Heading';

interface WidgetProps {
  title?: string;
  children?: React.ReactNode
}

export default function Widget({ title, children }: WidgetProps) {
  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <H4>{title}</H4>
        <div className={styles.spacer} />
      </div>
      <div className={styles.content}>
        { children }
      </div>
    </div>
  );
}
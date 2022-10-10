import styles from './Widget.module.css';
import React from 'react';
import Plate from './Plate';
import {H4} from './Heading';
import FlexCenteredContent from './FlexCenteredContent';

interface WidgetProps {
  title?: string;
  children?: React.ReactNode
}

export default function Widget({ title, children }: WidgetProps) {
  return (
    <div className={styles.widget}>
      <div className={styles.headerPlate}>
        <Plate>
          <FlexCenteredContent>
            <div className={styles.centerPlate}>
              <Plate>
                <H4>{title}</H4>
              </Plate>
            </div>
          </FlexCenteredContent>
        </Plate>
      </div>
      <div className={styles.content}>
        { children }
      </div>
      <div className={styles.footer}>
        <Plate/>
      </div>
    </div>
  );
}
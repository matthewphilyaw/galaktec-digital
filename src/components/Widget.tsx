import styles from './Widget.module.css';
import React from 'react';
import Plate from './Plate';
import {H4} from './Heading';
import FlexCenteredContent from './FlexCenteredContent';
import ButtonGroup, {ButtonGroupButton} from './ButtonGroup';

interface WidgetProps {
  title?: string;
  children?: React.ReactNode
}

export default function Widget({ title, children }: WidgetProps) {
  return (
    <div className={styles.widget}>
      <div className={styles.headerPlate}>
        <Plate randomizeBrightnessPlusOrMinus={30}>
          <FlexCenteredContent>
            <H4>{title}</H4>
          </FlexCenteredContent>
        </Plate>
      </div>
      <div className={styles.content}>
        { children }
      </div>
      <div className={styles.footer}>
        <Plate randomizeBrightnessPlusOrMinus={30} />
      </div>
    </div>
  );
}
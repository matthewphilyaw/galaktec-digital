import styles from './SolidButtonBar.module.css';
import Plate from './Plate';
import {LayoutPosition, LayoutOrientation} from './utils';
import ButtonGroup, {ButtonGroupButton} from './ButtonGroup';

export interface SolidButtonBarProps {
  layoutPosition: LayoutPosition;
  buttons: ButtonGroupButton[];
}

export interface SolidButtonBarButtonProps {
  text: string;
  click: () => void;
}

export function SolidButtonBar({ layoutPosition, buttons }: SolidButtonBarProps) {

  let layoutDirection: LayoutOrientation = 'vertical';
  if (layoutPosition === 'top' || layoutPosition === 'bottom') {
    layoutDirection = 'horizontal';
  }

  return (
    <div className={`${styles['content']} ${styles[layoutPosition]}`}>
      <Plate layoutOrientation={layoutDirection} withScrews={true} randomizeBrightnessPlusOrMinus={10}>
        <ButtonGroup buttons={buttons} layoutOrientation={layoutDirection} />
      </Plate>
    </div>
  );
}
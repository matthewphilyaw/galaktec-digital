import {LayoutOrientation} from './utils';
import Button, {ButtonProps} from './Button';
import styles from './ButtonGroup.module.css';

export type ButtonGroupButton = Omit<ButtonProps, 'layoutOrientation'>;

export interface ButtonGroupProps {
  layoutOrientation?: LayoutOrientation;
  buttons: ButtonGroupButton[];
}

export default function ButtonGroup({ layoutOrientation = 'horizontal', buttons }: ButtonGroupProps) {
  return (
    <div className={`${styles.group} ${styles[layoutOrientation]}`}>
      {buttons.map(({text, click }) => <Button key={text} text={text} click={click} layoutOrientation={layoutOrientation} />)}
    </div>
  );
}

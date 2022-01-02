import {Button, ButtonProps} from './Button';
import styles from './ButtonGroup.module.css';

export interface Buttons {
  icon?: string;
  text?: string;
  onClick?: () => void;
}

export interface ButtonGroupProps {
  buttons: Buttons[];
  size: 'small' | 'medium';
}

export function ButtonGroup(props: ButtonGroupProps) {
  const { buttons, size } = props;

  return (
    <div className={styles.buttonGroup}>
      { buttons.map(b => {
          return (
            <Button icon={b.icon} text={b.text} onClick={b.onClick} size={ size } />
          )
        })
      }
    </div>
  );
}


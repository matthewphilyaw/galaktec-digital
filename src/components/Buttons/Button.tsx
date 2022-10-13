import styles from './Button.module.css';
import {LayoutOrientation} from '../utils';

export interface ButtonProps {
  text: string;
  click: () => void;
  layoutOrientation?: LayoutOrientation;
}

export default function Button({ text, click, layoutOrientation = 'horizontal'}: ButtonProps) {
  return (
    <button className={`${styles.button} ${styles[layoutOrientation]}`} onClick={click}>
      <span>{text}</span>
    </button>
  );
}
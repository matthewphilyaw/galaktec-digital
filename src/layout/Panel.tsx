import styles from './Panel.module.css';
import {Button} from '../Button';

export interface PanelProps {
  headerContent?: any;
  children?: any;
  footerContent?: any;
}

export default function Panel(props: PanelProps) {
  return (
    <div className={styles.container}>
      <div className={styles['bar-top']}>{props.headerContent}</div>
      <div className={styles['bar-content']}>{props.children}</div>
      <div className={styles['bar-bottom']}>{props.footerContent}</div>
    </div>
  )
}
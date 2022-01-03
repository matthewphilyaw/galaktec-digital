import {ButtonGroupProps} from '../components/ButtonGroup';
import styles from './PanelHeader.module.css';

export interface PanelHeaderProps {
  text?: string;
  buttonGroup?: ButtonGroupProps;
}

export function PanelHeader(props: PanelHeaderProps) {
  const { text, buttonGroup } = props;

  return (
    <div className={styles.container}>
      <div className={styles.headerTextContainer}>{text}</div>
      <div className={styles.buttonGroupContainer}>{buttonGroup}</div>
    </div>
  );
}
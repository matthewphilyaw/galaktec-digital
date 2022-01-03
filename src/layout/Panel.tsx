import styles from './Panel.module.css';

export interface PanelProps {
  headerContent?: any;
  children?: any;
}

export default function Panel(props: PanelProps) {
  const { headerContent, children} =  props;

  return (
    <div className={styles.container}>
      <div className={styles.barHeader}>{headerContent}</div>
      <div className={[styles.barContent].join(' ')}>{children}</div>
    </div>
  );
}
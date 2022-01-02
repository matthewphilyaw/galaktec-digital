import styles from './Panel.module.css';

export interface PanelProps {
  headerContent?: any;
  children?: any;
  size: 'u1' | 'u2' | 'u3';
}

export default function Panel(props: PanelProps) {
  const { headerContent, children, size} =  props;

  let styledSize;

  if (size === 'u1') {
    styledSize = styles.u1;
  } else if (size === 'u2') {
    styledSize = styles.u2;
  } else if (size === 'u3') {
    styledSize = styles.u3;
  } else {
    throw new Error(`Invalid size: ${size}`);
  }


  return (
    <div className={styles.container}>
      <div className={styles.barHeader}>{headerContent}</div>
      <div className={[styles.barContent, styledSize].join(' ')}>{children}</div>
    </div>
  );
}
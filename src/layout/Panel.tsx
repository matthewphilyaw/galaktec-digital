import styles from './Panel.module.css';

export default function Panel(props: any) {
  return (
    <div className={styles.container}>
      <div className={styles['bar-top']}></div>
      <div className={styles['bar-content']}>{props.content}</div>
      <div className={styles['bar-bottom']}></div>
    </div>
  )
}
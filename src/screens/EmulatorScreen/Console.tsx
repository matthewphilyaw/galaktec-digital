import styles from './Console.module.css';
import {VMState} from '../../hooks/vm-wrapper';
import Widget from '../../components/layout/Widget';

export interface ConsoleProps {
  vmState: VMState
}

export default function Console(props: ConsoleProps) {
  const { vmState } = props;

  return (
    <div className={styles.console}>
      <Widget title={'Console'}>
        <div className={styles.content}>
          { vmState.consoleBuffer.map(line => {
            return (
              <div key={line.id} className={styles.line}>&gt; {line.value}</div>
            );
          })}
        </div>
      </Widget>
    </div>
  );
}
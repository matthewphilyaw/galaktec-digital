import styles from './Console.module.css';
import {useEffect, useRef} from 'react';
import {VMState} from '../../hooks/vm-wrapper';
import Widget from '../../components/Widget';

export interface ConsoleProps {
  vmState: VMState
}

export default function Console(props: ConsoleProps) {
  const { vmState } = props;
  const lastLineRef = useRef<HTMLDivElement>(null);

  const scrollToLastLine = () => {
    if (!lastLineRef.current) {
      return;
    }

    //lastLineRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToLastLine, [vmState]);

  return (
    <Widget title={'Console'}>
      <div className={styles.content}>
        { vmState.consoleBuffer.map(line => {
          return (
            <div key={line.id} className={styles.line}>&gt; {line.value}</div>
          );
        })}
        <div ref={lastLineRef} />
      </div>
    </Widget>
  );
}
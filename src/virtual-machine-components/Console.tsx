import styles from './Console.module.css';
import Panel from '../layout/Panel';
import {PanelHeader} from '../layout/PanelHeader';
import React, {useEffect, useRef} from 'react';

import {VMState} from '../hooks/use-virtual-machine';



export interface ConsoleProps {
  vmState: VMState
}

export function Console(props: ConsoleProps) {
  const { vmState } = props;
  const lastLineRef = useRef<HTMLDivElement>(null);

  const scrollToLastLine = () => {
    if (!lastLineRef.current) {
      return;
    }

    lastLineRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToLastLine, [vmState]);

  return (
    <div className={styles.Console}>
      <Panel headerContent={<PanelHeader text={'Console'}/>}>
        <div className={styles.content}>
          { vmState.consoleBuffer.map(line => {
            return (
              <div key={line.id} className={styles.line}>&gt; {line.value}</div>
            );
          })}
          <div ref={lastLineRef} />
        </div>
      </Panel>
    </div>
  );
}
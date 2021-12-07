import React, { useRef} from 'react';
import styles from './App.module.css';
import Panel from './layout/Panel';
import AssemblyEditor from './virtual-machine-components/AssemblyEditor';
import { useVirtualMachine } from './hooks/use-virtual-machine';
import { sampleProgram } from './virtual-machine/default-program';
import {VMStateBlock} from './virtual-machine-components/VMState';

function App() {
  const {vmState, controls }= useVirtualMachine(sampleProgram);

  const programRef = useRef(sampleProgram);
  const updateProgram = (value: string | undefined) => {
    if (value) {
      programRef.current = value;
    }
  };

  const buttons = (
    <div className={styles.buttons}>
      <button className={styles.btn} onClick={() => controls.loadProgram(programRef.current) } >
        <span className="material-icons mk-orange">upload</span><span>Load</span>
      </button>
      <button className={styles.btn} onClick={() => { controls.step() }}>
        <span className="material-icons mk-orange">play_arrow</span><span>Step</span>
      </button>
      <button className={styles.btn} onClick={() => controls.run() }>
        <span className="material-icons mk-orange" >skip_next</span><span>Run</span>
      </button>
    </div>
  );

  return (
    <div className={styles.layout}>
      <div className={styles.bar1}>
        <Panel content={<AssemblyEditor initialProgram={programRef.current} onChange={updateProgram} />} />
      </div>
      <div className={styles.bar2}>
        <Panel content={buttons} />
        <VMStateBlock state={vmState} dispatch={controls}></VMStateBlock>
      </div>
    </div>
  );
}

export default App;

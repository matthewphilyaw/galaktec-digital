import React, {useRef} from 'react';
import styles from './App.module.css';
import AppHeader from './layout/AppHeader';
import AssemblyEditor from './virtual-machine-components/AssemblyEditor';
import {sampleProgram} from './virtual-machine/default-program';
import {VMStateBlock} from './virtual-machine-components/VMStateBlock';
import {useVirtualMachine} from './hooks/use-virtual-machine';


function App() {
  const programRef = useRef(sampleProgram);
  const {vmState, controls} = useVirtualMachine(programRef.current);

  function updateProgramRef(program: string | undefined) {
    if (program) {
      programRef.current = program;
    }
  }

  function loadProgram() {
    controls.loadProgram(programRef.current);
  }

  return (
    <div className={styles.App}>
      <AppHeader onLoad={loadProgram} onRunInstruction={controls.run} onStepInstruction={controls.step} />
      <div className={styles.workspace}>
        <AssemblyEditor initialProgram={programRef.current} onChange={updateProgramRef}  />
        <VMStateBlock vmState={vmState} />
      </div>
    </div>
);
}

export default App;

import React, {useEffect, useRef, useState} from 'react';
import styles from './App.module.css';
import AppHeader from './layout/AppHeader';
import {sampleProgram} from './virtual-machine/default-program';
import {VMStateBlock} from './virtual-machine-components/VMStateBlock';
import {useVirtualMachine} from './hooks/use-virtual-machine';
import AssemblyEditorCM from './virtual-machine-components/assembly-editor/AssemblyEditorCM';
import {Console} from './virtual-machine-components/Console';


function App() {
  const programRef = useRef(sampleProgram);
  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const {vmState, controls} = useVirtualMachine();

  function updateProgramRef(program: string | undefined) {
    if (program) {
      programRef.current = program;
    }
  }

  function loadProgram() {
    controls.loadProgram(programRef.current);
  }

  useEffect(() => {
    if (firstTimeLoad) {
      loadProgram();
      setFirstTimeLoad(false);
    }
  });

  return (
    <div className={styles.App}>
      <AppHeader onLoad={loadProgram} onRunInstruction={controls.run} onStepInstruction={controls.step} />
      <div className={styles.workspace}>
        <div className={styles.leftArea}>
          <AssemblyEditorCM initialProgram={programRef.current} onChange={updateProgramRef}  />
          <Console vmState={vmState} />
        </div>
        <VMStateBlock vmState={vmState} />
      </div>
    </div>
  );
}

export default App;

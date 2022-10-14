import styles from './EmulatorScreen.module.css';
import CodeEditor from '../../components/CodeEditor/CodeEditor';
import {sampleProgram} from '../../virtual-machine/default-program';
import {useVirtualMachineContext} from '../../hooks/use-virtual-machine';
import {useEffect, useRef} from 'react';
import VirtualMachineStatus from './VirtualMachineStatus';

export default function EmulatorScreen() {
  const programRef = useRef(sampleProgram);
  const { controls, vmState } = useVirtualMachineContext();

  useEffect(() => {
    controls.loadProgram(programRef.current);
  }, []);

  const buttons = [
    { text: 'LOAD', click: () => { controls.loadProgram(programRef.current) } },
    { text: 'STEP', click: controls.step },
  ];

  function updateProgramRef(program: string | undefined) {
    if (program) {
      programRef.current = program;
    }
  }

  return (
    <div className={styles.content}>
      <CodeEditor initialProgram={sampleProgram} onChange={updateProgramRef}/>
      <div className={styles.vertSpacer} />
      <VirtualMachineStatus vmState={vmState} buttons={buttons} />
    </div>
  );
}
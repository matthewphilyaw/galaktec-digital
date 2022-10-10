import styles from './EmulatorScreen.module.css';
import CodeEditor from '../../components/CodeEditor/CodeEditor';
import {sampleProgram} from '../../virtual-machine/default-program';
import {ContentSpacer} from '../../components/ContentSpacer';
import {SolidButtonBar} from '../../components/SolidButtonBar';
import {useVirtualMachineContext} from '../../hooks/use-virtual-machine';
import RegisterView from './HartViewer/RegisterView';
import {useRef} from 'react';
import MemoryViewerWidget from './MemoryViewerWidget';
import Console from './Console';
import VirtualMachineStatus from './VirtualMachineStatus';

export default function EmulatorScreen() {
  const programRef = useRef(sampleProgram);
  const { controls, vmState } = useVirtualMachineContext();

  const buttons = [
    { text: 'LOAD', click: () => { controls.loadProgram(programRef.current) } },
    { text: 'RUN', click: controls.run },
    { text: 'STEP', click: controls.step },
  ];

  function updateProgramRef(program: string | undefined) {
    if (program) {
      programRef.current = program;
    }
  }

  return (
    <div className={styles.content}>
      <div className={styles.spacer}/>
      <CodeEditor initialProgram={sampleProgram} onChange={updateProgramRef}/>
      <div className={styles.vertSpacer}>
        <ContentSpacer/>
      </div>
      <div className={styles.sideNav}>
        <SolidButtonBar layoutPosition={'left'} buttons={buttons}/>
      </div>
      <VirtualMachineStatus vmState={vmState} />
    </div>
  );
}
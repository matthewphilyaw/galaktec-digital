import styles from './VirtualMachineStatus.module.css';
import MemoryViewerWidget from './MemoryViewerWidget';
import Console from './Console';
import {VMState} from '../../hooks/vm-wrapper';
import HartViewer from './HartViewer/HartViewer';
import ButtonGroup, {ButtonGroupButton} from '../../components/Buttons/ButtonGroup';

export interface VirtualMachineStatusProps {
  vmState: VMState;
  buttons: ButtonGroupButton[];
}

export default function VirtualMachineStatus({vmState, buttons}: VirtualMachineStatusProps) {

  return (
    <div className={styles.container}>
      <div className={styles.space}>
        <div className={styles.hart}>
          <HartViewer vmState={vmState}/>
        </div>
        <div className={styles.peripheralsWrapper}>
          <div className={styles.peripherals}>
            <div className={styles.memory}>
              <MemoryViewerWidget title={'Program Memory'} region={vmState.programDump} wordsPerRow={4}
                                  highlightAddresses={[vmState.coreState.programCounter]}/>
              <MemoryViewerWidget title={'Random Access Memory'} region={vmState.ramDump} wordsPerRow={4}/>
            </div>
            <Console vmState={vmState}/>
          </div>
        </div>
      </div>
    </div>
  );
}

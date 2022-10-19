import styles from './VirtualMachineStatus.module.css';
import MemoryViewerWidget, {MemoryHighlight} from './MemoryViewerWidget';
import Console from './Console';
import {VMState} from '../../hooks/vm-wrapper';
import HartViewer from './HartViewer/HartViewer';
import {ButtonGroupButton} from '../../components/Buttons/ButtonGroup';

export interface VirtualMachineStatusProps {
  vmState: VMState;
  buttons: ButtonGroupButton[];
}

export default function VirtualMachineStatus({vmState, buttons}: VirtualMachineStatusProps) {
  const highlights: MemoryHighlight[] = [];

  if (vmState.coreStates[0].pipelineState?.fetch?.fetchResult) {
    const address = vmState.coreStates[0].pipelineState?.fetch?.fetchResult.address;
    highlights.push({
      address: address,
      color: vmState.getAddressColor(address)
    })
  }

  if (vmState.coreStates[0].pipelineState?.decode?.fetchResult) {
    const address = vmState.coreStates[0].pipelineState?.decode?.fetchResult.address;
    highlights.push({
      address: address,
      color: vmState.getAddressColor(address)
    })
  }

  if (vmState.coreStates[0].pipelineState?.execute?.fetchResult) {
    const address = vmState.coreStates[0].pipelineState?.execute?.fetchResult.address;
    highlights.push({
      address: address,
      color: vmState.getAddressColor(address)
    })
  }

  if (vmState.coreStates[0].pipelineState?.memoryAccess?.fetchResult) {
    const address = vmState.coreStates[0].pipelineState?.memoryAccess?.fetchResult.address;
    highlights.push({
      address: address,
      color: vmState.getAddressColor(address)
    })
  }

  if (vmState.coreStates[0].pipelineState?.writeBack?.fetchResult) {
    const address = vmState.coreStates[0].pipelineState?.writeBack?.fetchResult.address;
    highlights.push({
      address: address,
      color: vmState.getAddressColor(address)
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.space}>
        <HartViewer vmState={vmState}/>
        <MemoryViewerWidget title={'Program Memory'} region={vmState.programDump} wordsPerRow={12}
                            highlightAddresses={highlights}/>
        <MemoryViewerWidget title={'Random Access Memory'} region={vmState.ramDump} wordsPerRow={12}/>
        <Console vmState={vmState}/>
      </div>
    </div>
  );
}

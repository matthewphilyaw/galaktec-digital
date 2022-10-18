import styles from './PipelineHistoryView.module.css';
import {PipelineState} from '../../../virtual-machine/risc-v/cpu-cores/proto-core';
import {VMState} from '../../../hooks/vm-wrapper';

export interface PipelineHistoryViewProps {
  vmState: VMState;
}

interface VerticalPipelineProps {
  label: string;
  pipelineState?: PipelineState;
  getAddressColor: (address?: number) => string;
}

function VerticalPipline({ label, pipelineState, getAddressColor }: VerticalPipelineProps) {
  return (
    <div className={styles.verticalPipeline}>
      <label className={styles.label}>{label}</label>
      <div className={styles[getAddressColor(pipelineState?.fetch?.fetchResult?.address)]} />
      <div className={styles[getAddressColor(pipelineState?.decode?.fetchResult?.address)]} />
      <div className={styles[getAddressColor(pipelineState?.execute?.fetchResult?.address)]} />
      <div className={styles[getAddressColor(pipelineState?.memoryAccess?.fetchResult?.address)]} />
      <div className={styles[getAddressColor(pipelineState?.writeBack?.fetchResult?.address)]} />
    </div>
  )
}

export default function PipelineHistoryView({ vmState }: PipelineHistoryViewProps) {
  return (
    <div className={styles.content}>
      <div className={styles.stages}>
        <label>T</label>
        <label>IF</label>
        <label>ID</label>
        <label>EX</label>
        <label>MEM</label>
        <label>WB</label>
      </div>
      <VerticalPipline label={'0'} pipelineState={vmState.coreStates[0]?.pipelineState} getAddressColor={vmState.getAddressColor} />
      <VerticalPipline label={'-1'} pipelineState={vmState.coreStates[1]?.pipelineState} getAddressColor={vmState.getAddressColor} />
      <VerticalPipline label={'-2'} pipelineState={vmState.coreStates[2]?.pipelineState} getAddressColor={vmState.getAddressColor} />
      <VerticalPipline label={'-3'} pipelineState={vmState.coreStates[3]?.pipelineState} getAddressColor={vmState.getAddressColor} />
      <VerticalPipline label={'-4'} pipelineState={vmState.coreStates[4]?.pipelineState} getAddressColor={vmState.getAddressColor} />
    </div>
  );
}
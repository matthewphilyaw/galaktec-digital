import styles from './PipelineView.module.css';
import {formatAsHex} from '../../../utils/number-formatting';
import {InstructionFormat} from '../../../virtual-machine/risc-v/cpu-cores/decoded-instruction';
import {ReactNode} from 'react';
import {H4} from '../../../components/layout/Heading';
import {CoreState, InstructionState} from '../../../virtual-machine/risc-v/cpu-cores/proto-core';

export interface PipelineDetailViewProps {
  coreState: CoreState;
  getAddressColor: (address?: number) => string;
}

interface PipelineStageStateProps {
  name: string;
  color: string;
  instructionState?: InstructionState;
}

function PipeLineStageState({ name, color, instructionState }: PipelineStageStateProps) {
  if (!instructionState) {
    return (
      <PipelineStateLayout stageName={name} color={color} bubble={true} />
    )
  }

  const labels: ReactNode[] = [];
  const values: ReactNode[] = [];

  if (instructionState.fetchResult !== undefined) {
    labels.push(...[
      <div>Address</div>,
      <div>Instruction</div>
    ]);

    values.push(...[
      <div>{formatAsHex(instructionState.fetchResult.address ?? 0)}</div>,
      <div>{formatAsHex(instructionState.fetchResult.instruction ?? 0)}</div>
    ]);
  }

  if (instructionState.decodeResult !== undefined) {
    labels.push(...[
      <div>Instr Format</div>,
      <div>RD Index</div>,
      <div>R1</div>,
      <div>R2</div>,
      <div>Immediate</div>
    ]);

    values.push(...[
      <div>{instructionState.decodeResult.instructionFormat ? InstructionFormat[instructionState.decodeResult.instructionFormat] : ' '}</div>,
      <div>{instructionState.decodeResult.destinationRegisterIndex}</div>,
      <div>{formatAsHex(instructionState.decodeResult.firstRegisterValue)}</div>,
      <div>{formatAsHex(instructionState.decodeResult.secondRegisterValue)}</div>,
      <div>{formatAsHex(instructionState.decodeResult.immediate)}</div>
    ]);
  }

  if (instructionState.executeResult !== undefined) {
    labels.push(...[
      <div>ALU Result</div>
    ]);

    values.push(...[
      <div>{formatAsHex(instructionState.executeResult.result)}</div>
    ]);
  }

  if (instructionState.memoryAccessResult !== undefined) {
    labels.push(...[
      <div>Memory Result</div>
    ]);

    values.push(...[
      <div>{formatAsHex(instructionState.memoryAccessResult)}</div>
    ]);
  }

  return (
    <PipelineStateLayout stageName={name} color={color}>
      <div className={styles.left}>
        {labels}
      </div>
      <div className={styles.right}>
        {values}
      </div>
    </PipelineStateLayout>
  )
}

function PipelineStateLayout({stageName, color, children, bubble = false}: {color: string, children?: ReactNode, stageName: string, bubble?: boolean}) {
  const pipelineStageStyle = [styles.cycle];
  if (bubble) {
    pipelineStageStyle.push(styles.bubble);
  } else {
    pipelineStageStyle.push(styles[color]);
  }


  return (
    <div className={styles.stage}>
      <div className={styles.heading}>
        <H4>{stageName}</H4>
      </div>
      <div className={pipelineStageStyle.join(' ')} />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}

export default function PipelineView({ coreState, getAddressColor }: PipelineDetailViewProps) {

  return (
    <div className={styles.container}>
      <div className={styles.pipelineDetailContainer}>
        <PipeLineStageState name={'IF'} color={getAddressColor(coreState.pipelineState.fetch?.fetchResult?.address)} instructionState={coreState.pipelineState.fetch} />
        <PipeLineStageState name={'ID'} color={getAddressColor(coreState.pipelineState.decode?.fetchResult?.address)} instructionState={coreState.pipelineState.decode} />
        <PipeLineStageState name={'EX'} color={getAddressColor(coreState.pipelineState.execute?.fetchResult?.address)} instructionState={coreState.pipelineState.execute} />
        <PipeLineStageState name={'MEM'} color={getAddressColor(coreState.pipelineState.memoryAccess?.fetchResult?.address)} instructionState={coreState.pipelineState.memoryAccess} />
        <PipeLineStageState name={'WB'} color={getAddressColor(coreState.pipelineState.writeBack?.fetchResult?.address)} instructionState={coreState.pipelineState.writeBack} />
      </div>
    </div>
  )
}
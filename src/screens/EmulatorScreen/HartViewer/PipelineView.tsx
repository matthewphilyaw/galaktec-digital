import styles from './PipelineView.module.css';
import {VMState} from '../../../hooks/vm-wrapper';
import {formatAsHex} from '../../../utils/number-formatting';
import {InstructionFormat} from '../../../virtual-machine/risc-v/cpu-cores/decoded-instruction';
import {ReactNode} from 'react';
import {H4} from '../../../components/Heading';

export interface PipelineDetailViewProps {
  vmState: VMState;
}

function PipelineStateLayout({stageName, cycleT, children}: {cycleT: number, children: ReactNode, stageName: string}) {
  return (
    <div className={styles.stage}>
      <div className={styles.heading}>
        <H4>{stageName}</H4>
      </div>
      <div className={[styles.cycle, styles[`cycle${cycleT.toString()}`]].join(' ')} />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}

export default function PipelineView({ vmState }: PipelineDetailViewProps) {
  return (
    <div className={styles.container}>
      <div className={styles.pipelineDetailContainer}>
        <PipelineStateLayout stageName={'IF'} cycleT={0}>
          <div className={styles.left}>
            <div>PC</div>
          </div>
          <div className={styles.right}>
            <div>{formatAsHex(vmState.coreState.programCounter)}</div>
          </div>
        </PipelineStateLayout>
        <PipelineStateLayout stageName={'ID'} cycleT={1}>
          <div className={styles.left}>
            <div>PC</div>
          </div>
          <div className={styles.right}>
            <div>{formatAsHex(vmState.coreState.programCounter)}</div>
          </div>
        </PipelineStateLayout>
        <PipelineStateLayout stageName={'EX'} cycleT={2}>
          <div className={styles.left}>
            <div>Instr Format</div>
            <div>R1</div>
            <div>R2</div>
            <div>RD Index</div>
            <div>Immediate</div>
          </div>
          <div className={styles.right}>
            <div>{vmState.coreState.decodedInstruction?.instructionFormat ? InstructionFormat[vmState.coreState.decodedInstruction.instructionFormat] : ' '}</div>
            <div>{vmState.coreState.decodedInstruction?.firstRegisterValue}</div>
            <div>{vmState.coreState.decodedInstruction?.secondRegisterValue}</div>
            <div>{vmState.coreState.decodedInstruction?.destinationRegisterIndex}</div>
            <div>{vmState.coreState.decodedInstruction?.immediate}</div>
          </div>
        </PipelineStateLayout>
        <PipelineStateLayout stageName={'MEM'} cycleT={3}>
          <div className={styles.left}>
            <div>Instr Format</div>
            <div>R1</div>
            <div>R2</div>
            <div>RD Index</div>
            <div>Immediate</div>
            <div>ALU Result</div>
          </div>
          <div className={styles.right}>
            <div>{vmState.coreState.decodedInstruction?.instructionFormat ? InstructionFormat[vmState.coreState.decodedInstruction.instructionFormat] : ' '}</div>
            <div>{vmState.coreState.decodedInstruction?.firstRegisterValue}</div>
            <div>{vmState.coreState.decodedInstruction?.secondRegisterValue}</div>
            <div>{vmState.coreState.decodedInstruction?.destinationRegisterIndex}</div>
            <div>{vmState.coreState.decodedInstruction?.immediate}</div>
            <div>{vmState.coreState.ALUResult}</div>
          </div>
        </PipelineStateLayout>
        <PipelineStateLayout stageName={'WB'} cycleT={4}>
          <div className={styles.left}>
            <div>Instr Format</div>
            <div>R1</div>
            <div>R2</div>
            <div>RD index</div>
            <div>Immediate</div>
            <div>ALU result</div>
            <div>Memory result</div>
          </div>
          <div className={styles.right}>
            <div>{vmState.coreState.decodedInstruction?.instructionFormat ? InstructionFormat[vmState.coreState.decodedInstruction.instructionFormat] : ' '}</div>
            <div>{vmState.coreState.decodedInstruction?.firstRegisterValue}</div>
            <div>{vmState.coreState.decodedInstruction?.secondRegisterValue}</div>
            <div>{vmState.coreState.decodedInstruction?.destinationRegisterIndex}</div>
            <div>{vmState.coreState.decodedInstruction?.immediate}</div>
            <div>{vmState.coreState.ALUResult}</div>
            <div>{vmState.coreState.memoryAccessResult}</div>
          </div>
        </PipelineStateLayout>
      </div>
    </div>
  )
}
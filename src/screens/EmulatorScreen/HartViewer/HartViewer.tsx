import styles from './HartViewer.module.css';
import {VMState} from '../../../hooks/vm-wrapper';
import Widget from '../../../components/Widget';
import RegisterView from './RegisterView';
import HartSectionLayout from './HartSectionLayout';
import {ContentSpacer} from '../../../components/ContentSpacer';

export interface HartViewerProps {
  vmState: VMState;
}

function HartDetails({ vmState }: { vmState: VMState}) {
  return (
    <div style={{padding: '0 1rem'}}>
      <div>PC: {vmState.coreState.programCounter.toString(16).padStart(8, '0')}</div>
      <div>Fetched Instr: {vmState.coreState.fetchedInstruction.toString(16).padStart(8, '0')}</div>
      <div>Formatted Instr:</div>
      <div>&emsp;Type: {vmState.fetchedInstructionContext?.instructionFormatType}</div>
      <div>&emsp;Instr:</div>
      <div>&emsp;{vmState.fetchedInstructionContext?.formattedEncodedInstructions}</div>
      <div>Full opcode: {vmState.coreState.decodedInstruction?.fullOpcode}</div>
      <div>Reg 1: {vmState.coreState.decodedInstruction?.firstRegisterValue}</div>
      <div>Reg 2: {vmState.coreState.decodedInstruction?.secondRegisterValue}</div>
      <div>Imm :{vmState.coreState.decodedInstruction?.immediate}</div>
      <div>Destination Reg: {vmState.coreState.decodedInstruction?.destinationRegisterIndex}</div>
      <div>Alu Result: {vmState.coreState.ALUResult}</div>
      <div>Access Result: {vmState.coreState.memoryAccessResult}</div>
    </div>
  );
}

export default function HartViewer({ vmState }: HartViewerProps) {
  return (
    <Widget title={'RISC V Hart'}>
      <div className={styles.content}>
        <HartSectionLayout title={'Registers'}>
          <RegisterView registerValues={vmState.coreState.registers} />
        </HartSectionLayout>
        <div className={styles.horizontalSpacer}></div>
        <HartSectionLayout title={'Pipeline'}>
          <HartDetails vmState={vmState} />
        </HartSectionLayout>
      </div>
    </Widget>
  )
}
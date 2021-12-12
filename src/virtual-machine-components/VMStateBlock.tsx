import React from 'react';
import { VMState} from '../hooks/use-virtual-machine';
import Panel from '../layout/Panel';
import styles from './VMStateBlock.module.css';
import {MemoryRegionDump} from '../virtual-machine/risc-v/cpu-cores/peripherals/memory';
import {Button} from '../Button';

interface FormattedMemoryLine {
  address: string;
  value: string[];
}

interface RegisterLine {
  index: number;
  name: string;
  value: string;
}

function formatMemoryDump(dump?: MemoryRegionDump): FormattedMemoryLine[] {
  const addrLines: FormattedMemoryLine[] = [];

  if (!dump) {
    return addrLines;
  }

  const rbDv = new DataView(dump.regionBuffer);
  for (let row = 0; row < dump.regionBuffer.byteLength; row+=4) {

    const address = dump.regionInfo.startAddress + row;

    const line: FormattedMemoryLine = {
      address: address.toString(16).padStart(8, '0'),
      value: []
    };

    for (let col = 0; col < 4; col++) {
      const value = rbDv.getUint8(row + col);
      line.value.push(value.toString(16).padStart(2, '0'));
    }

    addrLines.push(line);
  }

  return addrLines;
}

function formatRegisterValues(registers: number[]): RegisterLine[] {
  return registers.map((v, i) => {
    return {
      index: i,
      name: `x${i}`,
      value: (v >>> 0).toString(16).padStart(8, '0')
    };
  });
}

function StatePanelHeader(props: { title: string }) {
  return (
    <div className={styles['state-panel-header']}>
      <h3 className={"reset-margin"}>{props.title}</h3>
    </div>
  )
}

function PipelineState(props: VMStateBlockProps) {
  const { vmState } = props;

  return (
    <div className={styles['pipeline-state']}>
      <Panel headerContent={<StatePanelHeader title={"PC"} />}>
        <div className={styles['state-panel-content']}>
          <div>{vmState.coreState.programCounter}</div>
        </div>
      </Panel>
      <RegisterDump registers={vmState.coreState.registers}/>
      <Panel headerContent={<StatePanelHeader title={"Fetch"} />}>
        <div className={styles['state-panel-content']}>
          <div>{vmState.coreState.fetchedInstruction}</div>
          <div>{vmState.intermediateInstruction.formattedEncodedInstructions}</div>
        </div>
      </Panel>
      <Panel headerContent={<StatePanelHeader title={"Decode"} />}>
        <div className={styles['state-panel-content']}>
          <div>{vmState.coreState.decodedInstruction?.instructionFormat}</div>
          <div>{vmState.coreState.decodedInstruction?.fullOpcode}</div>
          <div>{vmState.coreState.decodedInstruction?.firstRegisterValue}</div>
          <div>{vmState.coreState.decodedInstruction?.secondRegisterValue}</div>
          <div>{vmState.coreState.decodedInstruction?.immediate}</div>
          <div>{vmState.coreState.decodedInstruction?.destinationRegisterIndex}</div>
        </div>
      </Panel>
      <Panel headerContent={<StatePanelHeader title={"Execute"} />}>
        <div className={styles['state-panel-content']}>
          <div>{vmState.coreState.ALUResult}</div>
        </div>
      </Panel>
      <Panel headerContent={<StatePanelHeader title={"Memory Access"} />}>
        <div className={styles['state-panel-content']}>
          <div>{vmState.coreState.memoryAccessResult}</div>
        </div>
      </Panel>
    </div>
  )
}

function RegionDump(props: { region: MemoryRegionDump }) {
  const { region } = props;
  const formattedMemory = formatMemoryDump(region);

  return (
    <Panel headerContent={<StatePanelHeader title={`${region.regionInfo.regionName} | ${region.regionInfo.lengthInBytes} (bytes)`} />}>
      <div className={styles["state-panel-content"]}>
        {formattedMemory.map((line) =>
          <div className={styles['region-dump-line']} key={line.address}>
            <div className={styles['region-dump-address']}>{line.address}</div>
            <div className={styles['region-dump-separator']}></div>
            <div className={styles['region-dump-value-line']}>
              {line.value.map((byte, i) => <div className={styles['region-dump-value-byte']} key={i}>{byte}</div>)}
            </div>
          </div>
        )}
      </div>
    </Panel>
  )
}

function RegisterDump(props: { registers: number[]}) {
  const { registers } = props;
  const formattedRegisters = formatRegisterValues(registers);

  return (
    <Panel headerContent={<StatePanelHeader title={"Registers"} />}>
      <div className={[styles['state-panel-content'], styles["register-dump-content"]].join(' ')}>
        {formattedRegisters.map((line) =>
          <div className={styles['register-dump-line']} key={line.name}>
            {line.index < 10 && <div className={styles['register-dump-register']}>&nbsp;{line.name}</div> }
            {line.index >= 10 && <div className={styles['register-dump-register']}>{line.name}</div> }
            <div className={styles['register-dump-separator']}></div>
            <div className={styles['register-dump-value']}>{line.value}</div>
          </div>
        )}
      </div>
    </Panel>
  )
}

export interface VMStateBlockProps {
  vmState: VMState
}

export function VMStateBlock(props: VMStateBlockProps) {
  const { vmState } = props;

  return (
    <div className={styles['state-content']}>
      <RegionDump region={vmState.programDump} />
      <RegionDump region={vmState.ramDump} />
      <PipelineState vmState={vmState} />
    </div>
  );
}
import React from 'react';
import { VMState} from '../hooks/use-virtual-machine';
import Panel from '../layout/Panel';
import styles from './VMStateBlock.module.css';
import {MemoryRegionDump} from '../virtual-machine/risc-v/cpu-cores/peripherals/memory';
import {PanelHeader} from '../layout/PanelHeader';

interface FormattedMemoryWord {
  value: string[];
  highlight: boolean;
}

interface FormattedMemoryLine {
  address: string;
  words: FormattedMemoryWord[];
}

interface RegisterLine {
  index: number;
  name: string;
  value: string;
}

function formatMemoryDump(dump?: MemoryRegionDump, highlightAddresses?: number[], wordsPerRow?: number): FormattedMemoryLine[] {
  const addrLines: FormattedMemoryLine[] = [];

  if (!dump) {
    return addrLines;
  }

  if (!wordsPerRow) {
    wordsPerRow = 1;
  }

  const rbDv = new DataView(dump.regionBuffer);
  for (let row = 0; row < dump.regionBuffer.byteLength; row+=(wordsPerRow * 4)) {

    const address = dump.regionInfo.startAddress + row;

    const line: FormattedMemoryLine = {
      address: address.toString(16).padStart(8, '0'),
      words: []
    };

    // highlight: highlightAddresses ? highlightAddresses.includes(address) : false,
    for (let groups = 0; groups < wordsPerRow; groups++) {
      const wordAddress = row + (groups * 4);

      let formattedWord: FormattedMemoryWord = {
        value: [],
        highlight: highlightAddresses?.includes(wordAddress) ?? false
      };

      line.words.push(formattedWord);
      if (wordAddress >= dump.regionInfo.lengthInBytes) {
        continue;
      }

      for (let word = 0; word < 4; word++) {
        const value = rbDv.getUint8(wordAddress + word);

        formattedWord.value.push(value.toString(16).padStart(2, '0'));
      }

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

function PipelineState(props: VMStateBlockProps) {
  const { vmState } = props;

  return (
    <div className={styles['pipeline-state']}>
      <Panel headerContent={<PanelHeader text={"CPU State"} />}>
        <div className={styles['state-panel-content']}>
          <div>PC: {vmState.coreState.programCounter}</div>
          <div>Fetched Instr: {vmState.coreState.fetchedInstruction}</div>
          <div>Formatted Instr:</div>
          <div>&emsp;Type: {vmState.intermediateInstruction.instructionFormatType}</div>
          <div>&emsp;Instr: {vmState.intermediateInstruction.formattedEncodedInstructions}</div>
          <div>Full opcode: {vmState.coreState.decodedInstruction?.fullOpcode}</div>
          <div>Reg 1: {vmState.coreState.decodedInstruction?.firstRegisterValue}</div>
          <div>Reg 2: {vmState.coreState.decodedInstruction?.secondRegisterValue}</div>
          <div>Imm :{vmState.coreState.decodedInstruction?.immediate}</div>
          <div>Destination Reg: {vmState.coreState.decodedInstruction?.destinationRegisterIndex}</div>
          <div>Alu Result: {vmState.coreState.ALUResult}</div>
          <div>Access Result: {vmState.coreState.memoryAccessResult}</div>
        </div>
      </Panel>
    </div>
  )
}

function RegionDump(props: { region: MemoryRegionDump, highlightAddresses?: number[], wordsPerRow?: number}) {
  const { region, highlightAddresses, wordsPerRow } = props;
  const formattedMemory = formatMemoryDump(region, highlightAddresses, wordsPerRow);

  return (
    <Panel headerContent={<PanelHeader text={`${region.regionInfo.regionName} | ${region.regionInfo.lengthInBytes} (bytes)`} />}>
      <div className={styles["region-dump-content"]}>
        {formattedMemory.map((line) => {
          return (
            <div className={styles['region-dump-line']} key={line.address}>
              <div className={styles['region-dump-address']}>{line.address}</div>
              <div className={styles['region-dump-separator']}></div>
              <div className={styles['region-dump-word-line']}>
              {line.words.map((word) => {
                return (
                  <div className={[styles['region-dump-word'], word.highlight ? styles['region-dump-word-highlight'] : ''].join(' ')}>
                    {word.value.map((byte, i) => <div className={styles['region-dump-value-byte']} key={i}>{byte}</div>)}
                  </div>
                )
              })}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  )
}

function RegisterDump(props: { registers: number[]}) {
  const { registers } = props;
  const formattedRegisters = formatRegisterValues(registers);

  return (
    <Panel headerContent={<PanelHeader text={"Registers"} />}>
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
      <div className={styles['state-memory-col']}>
        <RegisterDump registers={vmState.coreState.registers}/>
        <RegionDump region={vmState.programDump} highlightAddresses={[vmState.coreState.programCounter]}  wordsPerRow={4}/>
        <RegionDump region={vmState.ramDump} wordsPerRow={4} />
      </div>
      <PipelineState vmState={vmState} />
    </div>
  );
}
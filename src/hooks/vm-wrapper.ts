import {MemoryRegion, MemoryRegionDump} from '../virtual-machine/risc-v/cpu-cores/peripherals/memory';
import {CoreState, ProtoCore} from '../virtual-machine/risc-v/cpu-cores/proto-core';
import {assemble, AssemblerContext, AssemblerError} from '../virtual-machine/risc-v/assembler/assembler';

const programMemory: MemoryRegion = {
  regionName: 'program',
  startAddress: 0x0,
  lengthInBytes: 512,
  accessWidthInBytes: 1,
  clockCyclesForWrite: 4,
  clockCyclesForRead: 4,
  readonly: false
};

// Yes I know Random Access Memory Memory...
const ramMemory: MemoryRegion = {
  regionName: 'ram',
  startAddress: 0x200,
  lengthInBytes: 256,
  accessWidthInBytes: 1,
  clockCyclesForWrite: 1,
  clockCyclesForRead: 1,
  readonly: false
};

const protoMemoryLayout: MemoryRegion[] = [
  programMemory,
  ramMemory
];

let nextConsoleLineNumber = 0;
export interface ConsoleLine {
  id: number,
  value: string
}

export interface VMState {
  coreStates: CoreState[];
  programDump: MemoryRegionDump;
  ramDump: MemoryRegionDump;
  consoleBuffer: ConsoleLine[];
  error: Boolean;
  lastEventId: number;
  getAddressColor: (address?: number) => string;
}

export interface AddressColorMapValue {
  count: number;
  color: string;
}

export class VM {
  // do not execute anything with an event id less than or equal to the lastEventId
  private lastEventId: number = 0;
  private program: string;
  private core: ProtoCore;
  private assemblerCtx?: AssemblerContext;
  private readonly consoleBuffer: ConsoleLine[];
  private inErrorState: boolean;
  private coreStates: CoreState[];
  private addressColorMap: Map<number, AddressColorMapValue>;
  private availableColors: string[];

  constructor(program: string) {
    this.program = program;
    this.core = new ProtoCore(protoMemoryLayout);
    this.consoleBuffer = [];
    this.inErrorState = false;
    this.coreStates = [];
    this.addressColorMap = new Map<number, AddressColorMapValue>();
    this.availableColors = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];

    try {
      this.assemblerCtx = assemble(program, programMemory.lengthInBytes);
      this.core.loadProgram(this.assemblerCtx.programMemoryBuffer);
    } catch (error: unknown) {
      if (error instanceof AssemblerError) {
        this.setConsoleMessage(error.reason);
      }
      else if (error instanceof Error) {
        this.setConsoleMessage(error.message);
      }
      else {
        this.setConsoleMessage(JSON.stringify(error));
      }

      this.inErrorState = true;
    }

    this.updateSlots();
  }

  setConsoleMessage(msg: string) {
    this.consoleBuffer.push({
      id: nextConsoleLineNumber++,
      value: msg,
    })
  }

  getState(): VMState {
    return {
      coreStates: this.coreStates,
      ramDump: this.core.memoryController.getRegionDump('ram'),
      programDump: this.core.memoryController.getRegionDump('program'),
      consoleBuffer: this.consoleBuffer,
      error: this.inErrorState,
      lastEventId: this.lastEventId,
      getAddressColor: (number?: number) => this.getAddressColor(number)
    }
  }

  assignColor(address?: number) {
    if (address === undefined) {
      return;
    }

    const value = this.addressColorMap.get(address);
    if (!value) {
      const color = this.availableColors.pop();
      if (!color) {
        console.error('No color to assign for address:', address);
        return;
      }

      this.addressColorMap.set(address, {
        count: 0,
        color
      });

      return;
    }

    value.count++;
  }

  removeColor(address?: number) {
    if (address === undefined) {
      return;
    }

    if (!this.addressColorMap.has(address)) {
      return;
    }

    const value = this.addressColorMap.get(address);
    if (!value) {
      this.addressColorMap.delete(address);
      return;
    }


    if (value.count === 0) {
      this.availableColors.push(value.color);
      this.addressColorMap.delete(address);
    }

    value.count--;
  }

  updateSlots(): void {
    const latestCoreState = this.core.getState();

    this.coreStates.unshift(latestCoreState);
    if (this.coreStates.length > 9) {
      const state = this.coreStates.pop();
      this.removeColor(state?.pipelineState?.fetch?.fetchResult?.address);
    }

    this.assignColor(latestCoreState.pipelineState.fetch?.fetchResult?.address);
  }

  getAddressColor(address?: number): string {
    if (address === undefined) {
      return 'blank';
    }

    const value = this.addressColorMap.get(address);
    if (!value) {
      console.log('no color for address:', address);
      return 'blank';
    }

    return value.color;
  }

  tick(eventId: number) {
    if (this.inErrorState) {
      this.setConsoleMessage('VM is in an error state, must recreate VM.');
    }

    if (eventId <= this.lastEventId) {
      this.setConsoleMessage(`skipping tick for eventId: ${eventId} it's less than or equal to lastEventValue processed: ${this.lastEventId}`);
      return;
    }

    this.lastEventId = eventId;

    try {
      this.core.tick();
      this.updateSlots();
    } catch(error) {
      if (error instanceof Error) {
        this.setConsoleMessage(error.message);
      }
      else {
        this.setConsoleMessage(JSON.stringify(error));
      }

      this.inErrorState = true;
    }
  }
}
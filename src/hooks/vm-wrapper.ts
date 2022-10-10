import {MemoryRegion, MemoryRegionDump} from '../virtual-machine/risc-v/cpu-cores/peripherals/memory';
import {CoreState, ProtoCore} from '../virtual-machine/risc-v/cpu-cores/proto-core';
import {IntermediateInstruction} from '../virtual-machine/risc-v/assembler/intermediate-types';
import {assemble, AssemblerContext, AssemblerError} from '../virtual-machine/risc-v/assembler/assembler';

const programMemory: MemoryRegion = {
  regionName: 'program',
  startAddress: 0x0,
  lengthInBytes: 2048,
  accessWidthInBytes: 1,
  clockCyclesForWrite: 4,
  clockCyclesForRead: 4,
  readonly: false
};

// Yes I know Random Access Memory Memory...
const ramMemory: MemoryRegion = {
  regionName: 'ram',
  startAddress: 0x800,
  lengthInBytes: 1024,
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
  coreState: CoreState;
  fetchedInstructionContext?: IntermediateInstruction;
  currentInstructionContext?: IntermediateInstruction;
  programDump: MemoryRegionDump;
  ramDump: MemoryRegionDump;
  consoleBuffer: ConsoleLine[];
  error: Boolean;
  lastEventId: number;
}

export class VM {
  // do not execute anything with an event id less than or equal to the lastEventId
  private lastEventId: number = 0;
  private program: string;
  private core: ProtoCore;
  private assemblerCtx?: AssemblerContext;
  private readonly consoleBuffer: ConsoleLine[];
  private inErrorState: boolean;

  constructor(program: string) {
    this.program = program;
    this.core = new ProtoCore(protoMemoryLayout);
    this.consoleBuffer = [];
    this.inErrorState = false;

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
  }

  setConsoleMessage(msg: string) {
    this.consoleBuffer.push({
      id: nextConsoleLineNumber++,
      value: msg,
    })
  }

  getIntermediateInstruction(address: number): IntermediateInstruction | undefined {
    const intermediate = this.assemblerCtx?.programMap.get(address);

    if (!intermediate) {
      this.setConsoleMessage(`Can't find intermediate at address: ${address.toString(16).padStart(8, '0')}`);
    }

    return intermediate;
  }

  getState(): VMState {
    const coreState = this.core.getState();
    const currentAddress = this.core.getState().programCounter;

    let fetchedInstructionContext = undefined;
    if (coreState.pipelineState === 'decode') {
      fetchedInstructionContext = this.getIntermediateInstruction(currentAddress);
    }

    let currentInstruction = this.getIntermediateInstruction(currentAddress);

    return {
      coreState: this.core.getState(),
      fetchedInstructionContext,
      currentInstructionContext: currentInstruction,
      ramDump: this.core.memoryController.getRegionDump('ram'),
      programDump: this.core.memoryController.getRegionDump('program'),
      consoleBuffer: this.consoleBuffer,
      error: this.inErrorState,
      lastEventId: this.lastEventId
    }
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
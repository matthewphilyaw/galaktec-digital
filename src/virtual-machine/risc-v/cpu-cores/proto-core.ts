import {MemoryController, MemoryRegion} from './peripherals/memory';
import {FullOpcodeConstants, OpcodeGroupsConstants} from './opcode';
import {signExtend} from '../../utils/bit-manipulation';
import {DecodedInstruction, InstructionFormat} from './decoded-instruction';
import {executeInstruction, ExecutionResult} from './stages/execute-instruction';

export interface CoreState {
  pipelineState:  PipelineState;
  programCounter: number;
  registers: number[];

}

export interface FetchResult {
  address: number;
  instruction: number;
}

export interface PipelineState {
  fetch?: InstructionState;
  decode?: InstructionState;
  execute?: InstructionState;
  memoryAccess?: InstructionState;
  writeBack?: InstructionState;
}

export interface InstructionState {
  fetchResult?: FetchResult;
  decodeResult?: DecodedInstruction
  executeResult?: ExecutionResult;
  memoryAccessResult?: number;
}

export class ProtoCore {
  public  memoryController: MemoryController;
  private pc: number;
  private registers: number[] = new Array(32).fill(0);

  private pipeLineState: PipelineState;

  constructor(memoryController: MemoryRegion[]) {
    this.memoryController = new MemoryController(memoryController);
    this.pc = 0;

    this.pipeLineState = {};
  }

  loadProgram(programBuffer: ArrayBuffer): void {
    const dv = new DataView(programBuffer);

    for (let address = 0; address < programBuffer.byteLength; address++) {
      const byte = dv.getUint8(address);
      this.memoryController.writeByte(address, byte);
    }
  }

  getState(): CoreState {
    return {
      programCounter: this.pc,
      registers: this.registers,
      pipelineState: this.pipeLineState,
    };
  }

  tick(): void {
    // map previous state to current state
    let fetch: InstructionState | undefined = { };
    let decode = this.pipeLineState.fetch;
    const execute = this.pipeLineState.decode;
    const memoryAccess = this.pipeLineState.execute;
    const writeBack = this.pipeLineState.memoryAccess;

    // do write back first, so the registers are updated for decode stage in this cycle
    if (writeBack) {
      this.writeRegisters(writeBack);
    }

    if (fetch) {
      fetch.fetchResult = this.fetch(this.pc);
    }

    if (decode) {
      decode.decodeResult = this.decode(decode);
    }

    if (execute) {
      execute.executeResult = executeInstruction(execute);
    }

    // if branch detected, insert bubbles in decode/fetch
    // those instructions are no longer valid to process
    if (execute?.executeResult?.jumpTo !== undefined) {
      decode = undefined;
      fetch = undefined;

      this.pc = execute.executeResult.jumpTo;
    } else {
      this.pc += 4;
    }

    if (memoryAccess) {
      memoryAccess.memoryAccessResult = this.accessMemory(memoryAccess);
    }
    // commit current state for next tick
    this.pipeLineState = {
      fetch,
      decode,
      execute,
      memoryAccess,
      writeBack
    }
  }

  fetch(pc: number): FetchResult {
    return {
      address: pc,
      instruction: this.memoryController.readWord(pc)
    };
  }

  decode({ fetchResult }: InstructionState): DecodedInstruction | undefined {
    if (!fetchResult) {
      return;
    }

    const instruction = fetchResult.instruction;

    const opcode = instruction & 0x7F;
    const funct3 = (instruction >>> 12) & 0x7;

    const funct7 = (instruction >>> 25) & 0x7F;
    const rd = (instruction >>> 7) & 0x1f;
    const r1 = (instruction >>> 15) & 0x1f;
    const r2 = (instruction >>> 20) & 0x1f;

    let decoded = null;
    let immediate = 0;

    switch (opcode) {
      case OpcodeGroupsConstants.ALU_IMMEDIATE:{
        let fullOpCode;
        if (funct3 === 0b101) {
          fullOpCode = (funct7 << 10) | (funct3 << 7) | opcode;
        } else {
          fullOpCode = (funct3 << 7) | opcode;
        }

        immediate = signExtend((instruction >>> 20), 12);
        decoded = new DecodedInstruction(
          InstructionFormat.I,
          fullOpCode,
          rd,
          r1 === 0 ? 0 : this.registers[r1],
          0,
          immediate
        );
        break;
      }
      case OpcodeGroupsConstants.JALR:
      case OpcodeGroupsConstants.LOAD:
        immediate = signExtend((instruction >>> 20), 12);
        decoded = new DecodedInstruction(
          InstructionFormat.I,
          (funct3 << 7) | opcode,
          rd,
          r1 === 0 ? 0 : this.registers[r1],
          0,
          immediate
        );
        break;
      case OpcodeGroupsConstants.BRANCHING:
        const imm12 = ((funct7 >>> 6) << 11) | ((rd & 0x1) << 10) | ((funct7 & 0x3f) << 4) | ((rd & 0x1e) >>> 1 );
        decoded = new DecodedInstruction(
          InstructionFormat.B,
          (funct3 << 7) | opcode,
          0,
          r1 === 0 ? 0 : this.registers[r1],
          r2 === 0 ? 0 : this.registers[r2],
          signExtend(imm12, 12)
        );
        break;
      case OpcodeGroupsConstants.STORE:
        immediate = (funct7 << 5) | rd;
        decoded = new DecodedInstruction(
          InstructionFormat.S,
          (funct3 << 7) | opcode,
          0,
          r1 === 0 ? 0 : this.registers[r1],
          r2 === 0 ? 0 : this.registers[r2],
          signExtend(immediate, 12)
        );
        break;
      case OpcodeGroupsConstants.ALU:
        decoded = new DecodedInstruction(
          InstructionFormat.R,
          (funct7 << 10) | (funct3 << 7) | opcode,
          rd,
          r1 === 0 ? 0 : this.registers[r1],
          r2 === 0 ? 0 : this.registers[r2],
          0
        );
        break;
      case OpcodeGroupsConstants.JAL: {
        const imm1to10 = (instruction & 0x7FE00000) >>> 21;
        const imm11 = (instruction & 0x100000) >>> 20;
        const imm12to19 = (instruction & 0xFF000) >>> 12;
        const imm20 = (instruction & 0x80000000) >>> 31;

        immediate = 0;
        immediate = (imm20 << 20) | (imm12to19 << 12) | (imm11 << 11) | (imm1to10 << 1);
        immediate = signExtend(immediate, 20);

        decoded = new DecodedInstruction(
          InstructionFormat.J,
          opcode,
          rd,
          0,
          0,
          immediate // jump is relative to PC
        );
        break;
      }
      case OpcodeGroupsConstants.LUI:
      case OpcodeGroupsConstants.AUIPC: {

        immediate = instruction & 0xffff_f000;

        decoded = new DecodedInstruction(
          InstructionFormat.U,
          opcode,
          rd,
          0,
          0,
          immediate
        );
        break;
      }
      default:
        throw Error('Opcode not recognized!');
    }

    return decoded;
  }

  accessMemory({ decodeResult, executeResult } : InstructionState): number | undefined {
    if (!decodeResult || !executeResult) {
      return;
    }

    const opcode = decodeResult.fullOpcode & 0x7f;
    // If no memory operation is needed then forward the value in execution along
    if (opcode !== OpcodeGroupsConstants.LOAD && opcode !== OpcodeGroupsConstants.STORE) {
      return;
    }

    const address = executeResult.result;
    let result = undefined;
    switch (decodeResult.fullOpcode) {
      case FullOpcodeConstants.LW:
        // execution result will be a memory address
        result = this.memoryController.readWord(address);
        break;
      case FullOpcodeConstants.SW:
        this.memoryController.writeWord(address, decodeResult.secondRegisterValue);
        break;
      default:
        throw new Error('Opcode not supported');
    }

    return result;
  }

  // TODO: might need strong checks around which result to use vs checking for null
  writeRegisters({ decodeResult, executeResult, memoryAccessResult}: InstructionState): void {
    if (!decodeResult || !executeResult) {
      return;
    }

    // These formats don't modify registers
    if (decodeResult.instructionFormat === InstructionFormat.S ||
        decodeResult.instructionFormat === InstructionFormat.B) {
      return;
    }

    if (decodeResult.destinationRegisterIndex !== 0) {
      this.registers[decodeResult.destinationRegisterIndex] = memoryAccessResult ?? executeResult.result;
    }
  }

}
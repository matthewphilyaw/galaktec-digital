import {DecodedInstruction} from '../decoded-instruction';
import {FullOpcodeConstants} from '../opcode';
import {unsignedValue} from '../../../utils/bit-manipulation';

export interface ExecutionResult {
  result: number;
  jumpTo?: number;
}

const executeMap = new Map<number, (pc: number, decodedInstruction: DecodedInstruction) => ExecutionResult>();

executeMap.set(FullOpcodeConstants.LUI, lui);
executeMap.set(FullOpcodeConstants.AUIPC, auipc);
executeMap.set(FullOpcodeConstants.JAL, jal);
executeMap.set(FullOpcodeConstants.JALR, jalr);
executeMap.set(FullOpcodeConstants.BEQ, unknownInstruction);
executeMap.set(FullOpcodeConstants.BNE, unknownInstruction);
executeMap.set(FullOpcodeConstants.BLT, unknownInstruction);
executeMap.set(FullOpcodeConstants.BGE, unknownInstruction);
executeMap.set(FullOpcodeConstants.BLTU, unknownInstruction);
executeMap.set(FullOpcodeConstants.BGEU, unknownInstruction);
executeMap.set(FullOpcodeConstants.LB, unknownInstruction);
executeMap.set(FullOpcodeConstants.LH, unknownInstruction);
executeMap.set(FullOpcodeConstants.LW, genericFirstRegPlusImmediate);
executeMap.set(FullOpcodeConstants.LBU, unknownInstruction);
executeMap.set(FullOpcodeConstants.LHU, unknownInstruction);
executeMap.set(FullOpcodeConstants.SB, unknownInstruction);
executeMap.set(FullOpcodeConstants.SH, unknownInstruction);
executeMap.set(FullOpcodeConstants.SW, genericFirstRegPlusImmediate);
executeMap.set(FullOpcodeConstants.ADDI, genericFirstRegPlusImmediate);
executeMap.set(FullOpcodeConstants.SLTI, unknownInstruction);
executeMap.set(FullOpcodeConstants.SLTIU, unknownInstruction);
executeMap.set(FullOpcodeConstants.XORI, unknownInstruction);
executeMap.set(FullOpcodeConstants.ORI, unknownInstruction);
executeMap.set(FullOpcodeConstants.ANDI, unknownInstruction);
executeMap.set(FullOpcodeConstants.SLLI, unknownInstruction);
executeMap.set(FullOpcodeConstants.SRLI, unknownInstruction);
executeMap.set(FullOpcodeConstants.SRAI, unknownInstruction);
executeMap.set(FullOpcodeConstants.ADD, add);
executeMap.set(FullOpcodeConstants.SUB, sub);
executeMap.set(FullOpcodeConstants.SLL, unknownInstruction);
executeMap.set(FullOpcodeConstants.SLT, slt);
executeMap.set(FullOpcodeConstants.SLTU, sltu);
executeMap.set(FullOpcodeConstants.XOR, unknownInstruction);
executeMap.set(FullOpcodeConstants.SRL, unknownInstruction);
executeMap.set(FullOpcodeConstants.SRA, unknownInstruction);
executeMap.set(FullOpcodeConstants.OR, unknownInstruction);
executeMap.set(FullOpcodeConstants.AND, unknownInstruction);

function unknownInstruction(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  throw new Error(`unsupported instruction as PC(${pc}): ${decodedInstruction.fullOpcode}`);
}


export function executeInstruction(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  const execFunc = executeMap.get(decodedInstruction.fullOpcode);
  if (!execFunc) {
    throw new Error(`Unable to locate a function to run on FullOpCode(${decodedInstruction.fullOpcode})`);
  }

  return execFunc(pc, decodedInstruction);
}

export function genericFirstRegPlusImmediate(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: decodedInstruction.firstRegisterValue + decodedInstruction.immediate
  };
}

export function add(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: decodedInstruction.firstRegisterValue + decodedInstruction.secondRegisterValue
  };
}

export function slt(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  let result = 0;
  if (decodedInstruction.firstRegisterValue < decodedInstruction.secondRegisterValue) {
    result = 1;
  }

  return {
    result
  };
}

export function sltu(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  const reg1UnsignedVal = unsignedValue(decodedInstruction.firstRegisterValue);
  const reg2UnsignedVal = unsignedValue(decodedInstruction.secondRegisterValue);

  let result = 0;
  if (reg1UnsignedVal === 0) {
  if (reg2UnsignedVal !== reg1UnsignedVal) {
    result = 1;

  } else {
    result = 0;
  }

  } else if (reg1UnsignedVal < reg2UnsignedVal) {
    result = 1;
  }
  else {
    result = 0;
  }

  return {
    result
  };
}

export function sub(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: decodedInstruction.secondRegisterValue - decodedInstruction.firstRegisterValue
  };
}

export function lui(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: decodedInstruction.immediate
  };
}

export function auipc(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: pc + decodedInstruction.immediate
  };
}

export function jal (pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: pc + 4,
    jumpTo: pc + decodedInstruction.immediate
  };
}

export function jalr (pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: pc + 4,
    jumpTo: (decodedInstruction.firstRegisterValue + decodedInstruction.immediate) & 0xFFFF_FFFE
  };
}

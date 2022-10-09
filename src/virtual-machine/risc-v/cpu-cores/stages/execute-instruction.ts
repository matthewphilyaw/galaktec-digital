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
executeMap.set(FullOpcodeConstants.BEQ, beq);
executeMap.set(FullOpcodeConstants.BNE, bne);
executeMap.set(FullOpcodeConstants.BLT, blt);
executeMap.set(FullOpcodeConstants.BLTU, bltu);
executeMap.set(FullOpcodeConstants.BGE, bge);
executeMap.set(FullOpcodeConstants.BGEU, bgeu);
executeMap.set(FullOpcodeConstants.LB, unknownInstruction);
executeMap.set(FullOpcodeConstants.LH, unknownInstruction);
executeMap.set(FullOpcodeConstants.LW, lw);
executeMap.set(FullOpcodeConstants.LBU, unknownInstruction);
executeMap.set(FullOpcodeConstants.LHU, unknownInstruction);
executeMap.set(FullOpcodeConstants.SB, unknownInstruction);
executeMap.set(FullOpcodeConstants.SH, unknownInstruction);
executeMap.set(FullOpcodeConstants.SW, sw);
executeMap.set(FullOpcodeConstants.ADDI, addi);
executeMap.set(FullOpcodeConstants.SLTI, slti);
executeMap.set(FullOpcodeConstants.SLTIU, sltiu);
executeMap.set(FullOpcodeConstants.XORI, xori);
executeMap.set(FullOpcodeConstants.ORI, ori);
executeMap.set(FullOpcodeConstants.ANDI, andi);
executeMap.set(FullOpcodeConstants.SLLI, slli);
executeMap.set(FullOpcodeConstants.SRLI, srli);
executeMap.set(FullOpcodeConstants.SRAI, srai);
executeMap.set(FullOpcodeConstants.ADD, add);
executeMap.set(FullOpcodeConstants.SUB, sub);
executeMap.set(FullOpcodeConstants.SLT, slt);
executeMap.set(FullOpcodeConstants.SLTU, sltu);
executeMap.set(FullOpcodeConstants.SLL, sll);
executeMap.set(FullOpcodeConstants.SRL, srl);
executeMap.set(FullOpcodeConstants.SRA, sra);
executeMap.set(FullOpcodeConstants.OR, or);
executeMap.set(FullOpcodeConstants.AND, and);
executeMap.set(FullOpcodeConstants.XOR, xor);

export function executeInstruction(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  const execFunc = executeMap.get(decodedInstruction.fullOpcode);
  if (!execFunc) {
    throw new Error(`Unable to locate a function to run on FullOpCode(${decodedInstruction.fullOpcode})`);
  }

  return truncateTo32(execFunc(pc, decodedInstruction));
}

function unknownInstruction(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  throw new Error(`unsupported instruction as PC(${pc}): ${decodedInstruction.fullOpcode}`);
}

function lw(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: decodedInstruction.firstRegisterValue + decodedInstruction.immediate
  };
}

function sw(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: decodedInstruction.firstRegisterValue + decodedInstruction.immediate
  };
}

function add(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: decodedInstruction.firstRegisterValue + decodedInstruction.secondRegisterValue
  };
}

function slt(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: setLessThan(decodedInstruction.firstRegisterValue, decodedInstruction.secondRegisterValue)
  };
}

function sltu(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: setLessThanUnsigned(decodedInstruction.firstRegisterValue, decodedInstruction.secondRegisterValue)
  };
}

function sub(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: decodedInstruction.firstRegisterValue - decodedInstruction.secondRegisterValue
  };
}

function lui(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: decodedInstruction.immediate
  };
}

function auipc(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: pc + decodedInstruction.immediate
  };
}

function jal (pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: pc + 4,
    jumpTo: pc + decodedInstruction.immediate
  };
}

function jalr (pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: pc + 4,
    jumpTo: decodedInstruction.firstRegisterValue + decodedInstruction.immediate
  };
}


function xor(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: decodedInstruction.firstRegisterValue ^ decodedInstruction.secondRegisterValue
  }
}

function or(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: decodedInstruction.firstRegisterValue | decodedInstruction.secondRegisterValue
  }
}

function and(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: decodedInstruction.firstRegisterValue & decodedInstruction.secondRegisterValue
  }
}

function sll(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  const shiftBy = decodedInstruction.secondRegisterValue & 0x1f;
  return {
    result: decodedInstruction.firstRegisterValue << shiftBy
  }
}

function srl(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  const shiftBy = decodedInstruction.secondRegisterValue & 0x1f;
  return {
    result: decodedInstruction.firstRegisterValue >>> shiftBy
  }
}

function sra(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  const shiftBy = decodedInstruction.secondRegisterValue & 0x1f;
  return {
    result: decodedInstruction.firstRegisterValue >> shiftBy
  }
}

function addi(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: decodedInstruction.firstRegisterValue + decodedInstruction.immediate
  };

}

function slti(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: setLessThan(decodedInstruction.firstRegisterValue, decodedInstruction.immediate)
  };
}

function sltiu(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: setLessThanUnsigned(decodedInstruction.firstRegisterValue, decodedInstruction.immediate)
  };
}

function xori(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: decodedInstruction.firstRegisterValue ^ decodedInstruction.immediate
  };
}

function ori(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: decodedInstruction.firstRegisterValue | decodedInstruction.immediate
  };
}

function andi(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: decodedInstruction.firstRegisterValue & decodedInstruction.immediate
  };
}

function slli(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: decodedInstruction.firstRegisterValue << decodedInstruction.immediate
  };
}

function srli(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: decodedInstruction.firstRegisterValue >>> decodedInstruction.immediate
  };
}

function srai(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  return {
    result: decodedInstruction.firstRegisterValue >> decodedInstruction.immediate
  };
}

function beq(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {

  let result: ExecutionResult = {
    result: pc + 4,
  };

  if (decodedInstruction.firstRegisterValue === decodedInstruction.secondRegisterValue) {
    result.jumpTo = pc + decodedInstruction.immediate;
  }

  return result;
}

function bne(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  let result: ExecutionResult = {
    result: pc + 4,
  };

  if (decodedInstruction.firstRegisterValue !== decodedInstruction.secondRegisterValue) {
    result.jumpTo = pc + decodedInstruction.immediate;
  }

  return result;
}

function blt(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  let result: ExecutionResult = {
    result: pc + 4,
  };

  const less = setLessThan(decodedInstruction.firstRegisterValue, decodedInstruction.secondRegisterValue);

  if (less === 1) {
    result.jumpTo = pc + decodedInstruction.immediate;
  }

  return result;
}

function bltu(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  let result: ExecutionResult = {
    result: pc + 4,
  };

  const less = setLessThanUnsigned(decodedInstruction.firstRegisterValue, decodedInstruction.secondRegisterValue);

  if (less === 1) {
    result.jumpTo = pc + decodedInstruction.immediate;
  }

  return result;
}

function bge(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  let result: ExecutionResult = {
    result: pc + 4,
  };

  const less = setLessThan(decodedInstruction.firstRegisterValue, decodedInstruction.secondRegisterValue);

  if (less === 0) {
    result.jumpTo = pc + decodedInstruction.immediate;
  }

  return result;
}

function bgeu(pc: number, decodedInstruction: DecodedInstruction): ExecutionResult {
  let result: ExecutionResult = {
    result: pc + 4,
  };

  const less = setLessThanUnsigned(decodedInstruction.firstRegisterValue, decodedInstruction.secondRegisterValue);

  if (less === 0) {
    result.jumpTo = pc + decodedInstruction.immediate;
  }

  return result;
}


function truncateTo32(result: ExecutionResult): ExecutionResult {
  return {
    result: Math.imul(result.result, 1),
    jumpTo: result.jumpTo !== undefined ? Math.imul(result.jumpTo, 1) : undefined
  };
}

function setLessThan(first: number, second: number): number {
  return (first < second) ? 1 : 0;
}

function setLessThanUnsigned(first: number, second: number): number {
  const firstU = unsignedValue(first);
  const secondU = unsignedValue(second);

  return ((firstU === 0 && secondU !== firstU) || (firstU < secondU)) ? 1 : 0;
}
const OPCODE_MASK   = 0x7f;
const REGISTER_MASK = 0x1f;
const FUNC3_MASK    = 0x7;
const FUNC7_MASK    = 0x7F;
const IMM_12        = 0xFFF;
const IMM_U20        = 0xFFFFF;

function opcode(opcode: number): number {
  return opcode & OPCODE_MASK;
}

function rd(rd: number): number {
  return (rd & REGISTER_MASK) << 7;
}

function rs1(rs1: number): number {
  return (rs1 & REGISTER_MASK) << 15;
}

function rs2(rs2: number): number {
  return (rs2 & REGISTER_MASK) << 20;
}

function func3(func3: number): number {
  return (func3 & FUNC3_MASK) << 12;
}

function func7(func7: number): number {
  return (func7 & FUNC7_MASK) << 25;
}

function immIType(imm: number): number {
  return ((imm >>> 0) & IMM_12) << 20;
}

function immUType(imm: number): number {
  return ((imm >>> 0) & IMM_U20) << 12;
}

export function buildRType(oc: number, regD: number, regS1: number, regS2: number, f3: number, f7: number): number {
  const instr = func7(f7) | rs2(regS2) | rs1(regS1) | func3(f3) | rd(regD) | opcode(oc);
  return instr;
}

export function buildIType(oc: number, regD: number, regS1: number, imm: number, f3: number): number {
  const instr = immIType(imm) | rs1(regS1) | func3(f3) | rd(regD) | opcode(oc);
  return instr;
}

export function buildSType(oc: number, regS1: number, regS2: number, imm: number, f3: number): number {
  // Pass upper 7 bits of imm into func7 slot
  // and lower 5 bits of imm into rd
  const instr = func7(((imm >>> 0) >>> 5)) | rs2(regS2) | rs1(regS1) | func3(f3) | rd(imm) | opcode(oc);
  return instr;
}

export function buildBType(oc: number, regS1: number, regS2: number, imm: number, f3: number): number {
  imm = (imm >>> 0);

  const immBit12    = (imm >>> 11) & 0x1;
  const immBit11    = (imm >>> 10) & 0x1;
  const immBit1to4  = imm & 0xf;
  const immBit5to10 = (imm >>> 4) & 0x3f;

  const instr = func7((immBit12 << 6) | immBit5to10) |
    rs2(regS2)                           |
    rs1(regS1)                           |
    func3(f3)                            |
    rd((immBit1to4 << 1) | immBit11) |
    opcode (oc);
  return instr;
}

export function buildUType(oc: number, regD: number, imm: number): number {
  const instr = immUType(imm) | rd(regD) | opcode(oc);
  return instr;
}

export function buildJType(oc: number, regD: number, imm: number): number {
  imm = (imm >>> 0); // coercing to unsigned

  const immBit20       = (imm >>> 19) & 0x1;
  const immBit19to12   = (imm >>> 11) & 0xff;
  const immBit11       = (imm >>> 10) & 0x1;
  const immBit10to1    = imm & 0x3ff;

  const newImm = (immBit20 << 19) | (immBit10to1 << 9) | (immBit11 << 8 ) | immBit19to12;
  const instr = immUType(newImm) |  rd(regD) |  opcode(oc);
  return instr;
}


export const R_TYPE_PATTERN: number[] =  [7,  5, 5, 3, 5, 7];
export const I_TYPE_PATTERN: number[] =  [12, 5, 3, 5, 7];
export const S_TYPE_PATTERN: number[] =  [7,  5, 5, 3, 5, 7];
export const B_TYPE_PATTERN: number[] =  [1,  6, 5, 5, 3, 4, 1, 7];
export const U_TYPE_PATTERN: number[] =  [20, 5, 7];
export const J_TYPE_PATTERN: number[] =  [1, 10, 1, 8, 5, 7];
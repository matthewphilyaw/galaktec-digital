import {
  buildBType,
  buildIType,
  buildJType, buildRType, buildSType,
  buildUType,
} from './risc-v-instruction-builders';

export enum Instruction {
  'LUI' = 0b0110111,
  'AUIPC' = 0b0010111,
  'JAL' = 0b1101111,
  'JALR' = 0b1100111,
  'BEQ' = 0b1100011,
  'BNE' = 0b1100011,
  'BLT' = 0b1100011,
  'BGE' = 0b1100011,
  'BLTU' = 0b1100011,
  'BGEU' = 0b1100011,
  'LB' = 0b0000011,
  'LH' = 0b0000011,
  'LW' = 0b0000011,
  'LBU' = 0b0000011,
  'LHU' = 0b0000011,
  'SB' = 0b0100011,
  'SH' = 0b0100011,
  'SW' = 0b0100011,
  'ADDI' = 0b0010011,
  'SLTI' = 0b0010011,
  'SLTIU' = 0b0010011,
  'XORI' = 0b0010011,
  'ORI' = 0b0010011,
  'ANDI' = 0b0010011,
  'SLLI' = 0b0010011,
  'SRLI' = 0b0010011,
  'SRAI' = 0b0010011,
  'ADD' = 0b0110011,
  'SUB' = 0b0110011,
  'SLL' = 0b0110011,
  'SLT' = 0b0110011,
  'SLTU' = 0b0110011,
  'XOR' = 0b0110011,
  'SRL' = 0b0110011,
  'SRA' = 0b0110011,
  'OR' = 0b0110011,
  'AND' = 0b0110011,
  'FENCE' = 0b0001111,
  'FENCE.I' = 0b0001111,
  'ECALL' = 0b1110011,
  'EBREAK' = 0b1110011,
  'CSRRW' = 0b1110011,
  'CSRRS' = 0b1110011,
  'CSRRC' = 0b1110011,
  'CSRRWI' = 0b1110011,
  'CSRRSI' = 0b1110011,
  'CSRRCI' = 0b1110011,
}

export enum REGISTERS {
  x0 = 'x0',
  x1 = 'x1',
  x2 = 'x2',
  x3 = 'x3',
  x4 = 'x4',
  x5 = 'x5',
  x6 = 'x6',
  x7 = 'x7',
  x8 = 'x8',
  x9 = 'x9',
  x10 = 'x10',
  x11 = 'x11',
  x12 = 'x12',
  x13 = 'x13',
  x14 = 'x14',
  x15 = 'x15',
  x16 = 'x16',
  x17 = 'x17',
  x18 = 'x18',
  x19 = 'x19',
  x20 = 'x20',
  x21 = 'x21',
  x22 = 'x22',
  x23 = 'x23',
  x24 = 'x24',
  x25 = 'x25',
  x26 = 'x26',
  x27 = 'x27',
  x28 = 'x28',
  x29 = 'x29',
  x30 = 'x30',
  x31 = 'x31',
  pc = 'pc',
  zero = 'zero',
  ra = 'ra',
  sp = 'sp',
  gp = 'gp',
  tp = 'tp',
  t0 = 't0',
  t1 = 't1',
  t2 = 't2',
  s0 = 's0',
  fp = 'fp',
  s1 = 's1',
  a0 = 'a0',
  a1 = 'a1',
  a2 = 'a2',
  a3 = 'a3',
  a4 = 'a4',
  a5 = 'a5',
  a6 = 'a6',
  a7 = 'a7',
  s2 = 's2',
  s3 = 's3',
  s4 = 's4',
  s5 = 's5',
  s6 = 's6',
  s7 = 's7',
  s8 = 's8',
  s9 = 's9',
  s10 = 's10',
  s11 = 's11',
  t3 = 't3',
  t4 = 't4',
  t5 = 't5',
  t6 = 't6'
}

const REGISTER_MAP: Readonly<Record<string, number>> = {
  'x0': 0,
  'x1': 1,
  'x2': 2,
  'x3': 3,
  'x4': 4,
  'x5': 5,
  'x6': 6,
  'x7': 7,
  'x8': 8,
  'x9': 9,
  'x10': 10,
  'x11': 11,
  'x12': 12,
  'x13': 13,
  'x14': 14,
  'x15': 15,
  'x16': 16,
  'x17': 17,
  'x18': 18,
  'x19': 19,
  'x20': 20,
  'x21': 21,
  'x22': 22,
  'x23': 23,
  'x24': 24,
  'x25': 25,
  'x26': 26,
  'x27': 27,
  'x28': 28,
  'x29': 29,
  'x30': 30,
  'x31': 31,
  'pc': 32,
  'zero': 0,
  'ra': 1,
  'sp': 2,
  'gp': 3,
  'tp': 4,
  't0': 5,
  't1': 6,
  't2': 7,
  's0': 8,
  'fp': 8,
  's1': 9,
  'a0': 10,
  'a1': 11,
  'a2': 12,
  'a3': 13,
  'a4': 14,
  'a5': 15,
  'a6': 16,
  'a7': 17,
  's2': 18,
  's3': 19,
  's4': 20,
  's5': 21,
  's6': 22,
  's7': 23,
  's8': 24,
  's9': 25,
  's10': 26,
  's11': 27,
  't3': 28,
  't4': 29,
  't5': 30,
  't6': 31,
};

export function validInstruction(instruction: string): boolean {
  const instructionKey = instruction as keyof typeof Instruction;
  return Instruction[instructionKey] !== undefined;
}


export function LUI(rd: string, imm: number): number {
  return buildUType(Instruction.LUI, REGISTER_MAP[rd], imm);
}

export function AUIPC(rd: string, imm: number): number {
  return buildUType(Instruction.AUIPC, REGISTER_MAP[rd], imm);
}

export function JAL(rd: string, imm: number): number {
  return buildJType(Instruction.JAL, REGISTER_MAP[rd], imm);
}

export function JALR(rd: string, rs1: string, imm: number): number {
  return buildIType(Instruction.JALR, REGISTER_MAP[rd], REGISTER_MAP[rs1], imm, 0b000);
}

export function BEQ(rs1: string, rs2: string, imm: number): number {
  return buildBType(Instruction.BEQ, REGISTER_MAP[rs1], REGISTER_MAP[rs2], imm, 0b000);
}

export function BNE(rs1: string, rs2: string, imm: number): number {
  return buildBType(Instruction.BNE, REGISTER_MAP[rs1], REGISTER_MAP[rs2], imm, 0b001);
}

export function BLT(rs1: string, rs2: string, imm: number): number {
  return buildBType(Instruction.BLT, REGISTER_MAP[rs1], REGISTER_MAP[rs2], imm, 0b100);
}

export function BGE(rs1: string, rs2: string, imm: number): number {
  return buildBType(Instruction.BGE, REGISTER_MAP[rs1], REGISTER_MAP[rs2], imm, 0b101);
}

export function BLTU(rs1: string, rs2: string, imm: number): number {
  return buildBType(Instruction.BLTU, REGISTER_MAP[rs1], REGISTER_MAP[rs2], imm, 0b110);
}

export function BGEU(rs1: string, rs2: string, imm: number): number {
  return buildBType(Instruction.BGEU, REGISTER_MAP[rs1], REGISTER_MAP[rs2], imm, 0b111);
}

export function LB(rd: string, rs1: string, imm: number): number {
  return buildIType(Instruction.LB, REGISTER_MAP[rd], REGISTER_MAP[rs1], imm, 0b000);
}

export function LH(rd: string, rs1: string, imm: number): number {
  return buildIType(Instruction.LH, REGISTER_MAP[rd], REGISTER_MAP[rs1], imm, 0b001);
}

export function LW(rd: string, rs1: string, imm: number): number {
  return buildIType(Instruction.LW, REGISTER_MAP[rd], REGISTER_MAP[rs1], imm, 0b010);
}

export function LBU(rd: string, rs1: string, imm: number): number {
  return buildIType(Instruction.LBU, REGISTER_MAP[rd], REGISTER_MAP[rs1], imm, 0b100);
}

export function LHU(rd: string, rs1: string, imm: number): number {
  return buildIType(Instruction.LHU, REGISTER_MAP[rd], REGISTER_MAP[rs1], imm, 0b101);
}

export function SB(rs1: string, rs2: string, imm: number): number {
  return buildSType(Instruction.SB, REGISTER_MAP[rs1], REGISTER_MAP[rs2], imm, 0b000);
}

export function SH(rs1: string, rs2: string, imm: number): number {
  return buildSType(Instruction.SH, REGISTER_MAP[rs1], REGISTER_MAP[rs2], imm, 0b001);
}

export function SW(rs1: string, rs2: string, imm: number): number {
  return buildSType(Instruction.SW, REGISTER_MAP[rs1], REGISTER_MAP[rs2], imm, 0b010);
}

export function ADDI(rd: string, rs1: string, imm: number): number {
  return buildIType(Instruction.ADDI, REGISTER_MAP[rd], REGISTER_MAP[rs1], imm, 0b000);
}

export function SLTI(rd: string, rs1: string, imm: number): number {
  return buildIType(Instruction.SLTI, REGISTER_MAP[rd], REGISTER_MAP[rs1], imm, 0b010);
}

export function SLTIU(rd: string, rs1: string, imm: number): number {
  return buildIType(Instruction.SLTIU, REGISTER_MAP[rd], REGISTER_MAP[rs1], imm, 0b011);
}

export function XORI(rd: string, rs1: string, imm: number): number {
  return buildIType(Instruction.XORI, REGISTER_MAP[rd], REGISTER_MAP[rs1], imm, 0b100);
}

export function ORI(rd: string, rs1: string, imm: number): number {
  return buildIType(Instruction.ORI, REGISTER_MAP[rd], REGISTER_MAP[rs1], imm, 0b110);
}

export function ANDI(rd: string, rs1: string, imm: number): number {
  return buildIType(Instruction.ANDI, REGISTER_MAP[rd], REGISTER_MAP[rs1], imm, 0b111);
}

export function SLLI(rd: string, rs1: string, shiftAmount: number): number {
  const imm =  (shiftAmount & 0x1f);
  return buildIType(Instruction.SLLI, REGISTER_MAP[rd], REGISTER_MAP[rs1], imm, 0b001);
}

export function SRLI(rd: string, rs1: string, shiftAmount: number): number {
  const imm =  (shiftAmount & 0x1f);
  return buildIType(Instruction.SRLI, REGISTER_MAP[rd], REGISTER_MAP[rs1], imm, 0b101);
}

export function SRAI(rd: string, rs1: string, shiftAmount: number): number {
  const imm =  (0x400) | (shiftAmount & 0x1f); // 010000XXXXX where XXXXX is the shift amount
  return buildIType(Instruction.SRAI, REGISTER_MAP[rd], REGISTER_MAP[rs1], imm, 0b101);
}

export function ADD(rd: string, rs1: string, rs2: string): number {
  return buildRType(Instruction.ADD, REGISTER_MAP[rd], REGISTER_MAP[rs1], REGISTER_MAP[rs2], 0b000, 0b0000000);
}

export function SUB(rd: string, rs1: string, rs2: string): number {
  return buildRType(Instruction.SUB, REGISTER_MAP[rd], REGISTER_MAP[rs1], REGISTER_MAP[rs2], 0b000, 0b0100000);
}

export function SLL(rd: string, rs1: string, rs2: string): number {
  return buildRType(Instruction.SLL, REGISTER_MAP[rd], REGISTER_MAP[rs1], REGISTER_MAP[rs2], 0b001, 0b0000000);
}

export function SLT(rd: string, rs1: string, rs2: string): number {
  return buildRType(Instruction.SLT, REGISTER_MAP[rd], REGISTER_MAP[rs1], REGISTER_MAP[rs2], 0b010, 0b0000000);
}

export function SLTU(rd: string, rs1: string, rs2: string): number {
  return buildRType(Instruction.SLTU, REGISTER_MAP[rd], REGISTER_MAP[rs1], REGISTER_MAP[rs2], 0b011, 0b0000000);
}

export function XOR(rd: string, rs1: string, rs2: string): number {
  return buildRType(Instruction.XOR, REGISTER_MAP[rd], REGISTER_MAP[rs1], REGISTER_MAP[rs2], 0b100, 0b0000000);
}

export function SRL(rd: string, rs1: string, rs2: string): number {
  return buildRType(Instruction.SRL, REGISTER_MAP[rd], REGISTER_MAP[rs1], REGISTER_MAP[rs2], 0b101, 0b0000000);
}

export function SRA(rd: string, rs1: string, rs2: string): number {
  return buildRType(Instruction.SRA, REGISTER_MAP[rd], REGISTER_MAP[rs1], REGISTER_MAP[rs2], 0b101, 0b0100000);
}

export function OR(rd: string, rs1: string, rs2: string): number {
  return buildRType(Instruction.SRA, REGISTER_MAP[rd], REGISTER_MAP[rs1], REGISTER_MAP[rs2], 0b110, 0b0000000);
}

export function AND(rd: string, rs1: string, rs2: string): number {
  return buildRType(Instruction.SRA, REGISTER_MAP[rd], REGISTER_MAP[rs1], REGISTER_MAP[rs2], 0b111, 0b0000000);
}

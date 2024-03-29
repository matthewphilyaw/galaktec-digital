export class FullOpcodeConstants {
  public static LUI: number = 0b0110111;
  public static AUIPC: number = 0b0010111;
  public static JAL: number = 0b1101111;
  public static JALR: number = 0b1100111;
  public static BEQ: number = 0b000_1100011;
  public static BNE: number = 0b001_1100011;
  public static BLT: number = 0b100_1100011;
  public static BGE: number = 0b101_1100011;
  public static BLTU: number = 0b110_1100011;
  public static BGEU: number = 0b111_1100011;
  public static LB: number = 0b000_0000011;
  public static LH: number = 0b001_0000011;
  public static LW: number = 0b010_0000011;
  public static LBU: number = 0b100_0000011;
  public static LHU: number = 0b101_0000011;
  public static SB: number = 0b000_0100011;
  public static SH: number = 0b001_0100011;
  public static SW: number = 0b010_0100011;
  public static ADDI: number = 0b000_0010011;
  public static SLTI: number = 0b010_0010011;
  public static SLTIU: number = 0b011_0010011;
  public static XORI: number = 0b100_0010011;
  public static ORI: number = 0b110_0010011;
  public static ANDI: number = 0b111_0010011;
  public static SLLI: number = 0b001_0010011;
  public static SRLI: number = 0b101_0010011;
  public static SRAI: number = 0b100000_101_0010011;
  public static ADD: number = 0b000_0110011;
  public static SUB: number = 0b0100000_000_0110011;
  public static SLL: number = 0b001_0110011;
  public static SLT: number = 0b010_0110011;
  public static SLTU: number = 0b011_0110011;
  public static XOR: number = 0b100_0110011;
  public static SRL: number = 0b101_0110011;
  public static SRA: number = 0b0100000_101_0110011;
  public static OR: number = 0b110_0110011;
  public static AND: number = 0b111_0110011;
}

export class OpcodeGroupsConstants {
  public static LUI: number = 0b0110111;
  public static AUIPC: number = 0b0010111;
  public static JAL: number = 0b1101111;
  public static JALR: number = 0b1100111;
  public static BRANCHING = 0b1100011;
  public static LOAD = 0b0000011;
  public static STORE = 0b0100011;
  public static ALU_IMMEDIATE = 0b0010011;
  public static ALU = 0b0110011;
}
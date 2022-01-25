export enum InstructionFormat {
  R,
  I,
  S,
  B,
  U,
  J
}

export class DecodedInstruction {
  constructor(
    public instructionFormat: InstructionFormat,
    public fullOpcode: number, // combines opcode, func3 and func7 for  easy comparison
    public destinationRegisterIndex: number,
    public firstRegisterValue: number,
    public secondRegisterValue: number,
    public immediate: number,
  ) {
  }
}
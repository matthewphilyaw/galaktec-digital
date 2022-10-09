
export function signExtend(value: number, bits: number, width: number = 32): number {
  const shiftBy = (width - bits);
  return (value << shiftBy) >> shiftBy;
}

export function unsignedValue(signedNumber: number): number {
  return signedNumber >>> 0;
}
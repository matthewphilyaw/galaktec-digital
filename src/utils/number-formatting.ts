function formatUnsignedAndPad(num: number, radix: number, padding: number): string {
  return (num >>> 0).toString(radix).padStart(padding, '0');
}

export function formatAsHex(num: number, padding: number = 8): string {
  return formatUnsignedAndPad(num, 16, padding);
}

export function formatAsBinary(num: number, padding: number = 32): string {
  return formatUnsignedAndPad(num, 2, padding);
}
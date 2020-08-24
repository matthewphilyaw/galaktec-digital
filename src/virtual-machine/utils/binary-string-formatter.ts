export enum Chunk {
  NIBBLE,
  BYTE,
  CUSTOM,
  NONE
}

function formatStr(bin: string, pattern: number[], seperator: string = ' '): string {
  let pos = 0;

  const pieces: string[] = [];
  for (const partLength of pattern) {
    const end = pos + partLength;

    pieces.push(bin.slice(pos, end));

    pos = end;
  }

  return pieces.join(seperator);
}


function formatWord(chunk: Chunk, word: string, bytePattern: number[], nibblePattern: number[], customPattern: number[]): string {
  let str: string;
  switch (chunk) {
    case Chunk.NONE:
      str = word;
      break;
    case Chunk.CUSTOM:
      str = formatStr(word, customPattern);
      break;
    case Chunk.BYTE:
      str = formatStr(word, bytePattern);
      break;
    case Chunk.NIBBLE:
      str = formatStr(word, nibblePattern);
      break;
    default:
      throw new Error(`Uknown type ${chunk}`);
  }

  return str;
}

export function binByte(byte: number): string {
  return (byte >>> 0).toString(2).padStart(8, '0');
}

export function binWord(word: number, chunk: Chunk = Chunk.BYTE, pattern: number[] = []): string {
  const bin = (word >>> 0).toString(2).padStart(32, '0');
  return formatWord(chunk, bin, Array(4).fill(8), Array(8).fill(4), pattern);
}

export function hexWord(word: number, chunk: Chunk = Chunk.BYTE, pattern: number[] = []): string {
  const bin = (word >>> 0).toString(16).padStart(8, '0').toUpperCase();
  return formatWord(chunk, bin, Array(4).fill(2), Array(8).fill(1), pattern);
}

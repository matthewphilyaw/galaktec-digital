import {binByte} from '../../../utils/binary-string-formatter';

export interface MemoryRegion {
  regionName: string;

  startAddress: number;
  lengthInBytes: number;

  accessWidthInBytes: number;

  clockCyclesForWrite: number;
  clockCyclesForRead: number;

  readonly: boolean;
}

export interface MemoryRegionDump {
  regionInfo: MemoryRegion;
  regionBuffer: ArrayBuffer;
}

export class MemoryController {
  private readonly memoryRegions: MemoryRegion[];
  private memoryBuffer: DataView;

  public constructor(memoryRegions: MemoryRegion[]) {
    this.memoryRegions = memoryRegions.sort((a, b) => {
      if (a.startAddress < b.startAddress) {
        return -1;
      } else if (a.startAddress > b.startAddress) {
        return 1;
      } else {
        return 0;
      }
    });

    const total = this.memoryRegions.reduce((runningTotal, mr) => runningTotal + mr.lengthInBytes, 0);
    this.memoryBuffer = new DataView(new ArrayBuffer(total));
  }

  private lookupMemoryRegion(address: number): MemoryRegion {
    const mr = this.memoryRegions.find(p => (p.startAddress + p.lengthInBytes) >= address);

    if (!mr) {
      throw new Error(`Invalid address - no memory region that maps to address: ${address.toString(16)}`);
    }

    return mr;
  }

  writeByte(address: number, value: number): number {
    const mr = this.lookupMemoryRegion(address);

    if (mr.accessWidthInBytes > 1) {
      throw new Error(`Can not write a single byte from to this memory region. It must be written ${mr.accessWidthInBytes} bytes at a time`);
    }

    const offset = address - mr.startAddress;
    this.memoryBuffer.setUint8(offset, value);

    return mr.clockCyclesForWrite;
  }

  writeHalfWord(address: number, value: number): number {
    const mr = this.lookupMemoryRegion(address);

    if (mr.accessWidthInBytes > 2) {
      throw new Error(`Can not write a half word to this memory region. It must be written ${mr.accessWidthInBytes} bytes at a time`);
    }

    const offset = address - mr.startAddress;
    this.memoryBuffer.setUint16(offset, value, true);

    return mr.clockCyclesForWrite;
  }

  writeWord(address: number, value: number): number {
    const mr = this.lookupMemoryRegion(address);

    if (mr.accessWidthInBytes > 4) {
      throw new Error(`Can not write a word to this memory region. It must be written ${mr.accessWidthInBytes} bytes at a time`);
    }

    this.memoryBuffer.setUint32(address, value, true);

    return mr.clockCyclesForWrite;
  }

  readByte(address: number): number {
    const mr = this.lookupMemoryRegion(address);

    if (mr.accessWidthInBytes > 1) {
      throw new Error(`Can not read a single byte from this memory region. It must be read ${mr.accessWidthInBytes} bytes at a time`);
    }

    const offset = address - mr.startAddress;
    return this.memoryBuffer.getUint8(offset);
  }

  readHalfWord(address: number): number {
    const mr = this.lookupMemoryRegion(address);

    if (mr.accessWidthInBytes > 2) {
      throw new Error(`Can not read a half word from this memory region. It must be read ${mr.accessWidthInBytes} bytes at a time`);
    }

    const offset = address - mr.startAddress;
    return this.memoryBuffer.getUint16(offset, true);
  }

  readWord(address: number): number {
    const mr = this.lookupMemoryRegion(address);

    if (mr.accessWidthInBytes > 4) {
      throw new Error(`Can not read a word from this memory region. It must be read ${mr.accessWidthInBytes} bytes at a time`);
    }

    return this.memoryBuffer.getUint32(address, true);
  }

  dumpMemories(columns: number): void {
    for (const mr of this.memoryRegions) {
      const endAddress = (mr.startAddress + mr.lengthInBytes);
      console.log(`Region: ${mr.regionName} - start: 0x${mr.startAddress.toString(16)}, end: 0x${endAddress.toString(16)}, length: ${mr.lengthInBytes}`);
      console.log();


      for (let address = mr.startAddress; address < endAddress; address += 4) {
        const columnValues: string[] = [];
        for (let colNum = 0; colNum < columns; colNum++) {
          const offset = address + colNum;
          const byte = this.memoryBuffer.getUint8(offset);
          columnValues.push(binByte(byte));
        }

        console.log(`0x${address.toString(16).padStart(4, '0')}: ${columnValues.join(' ')}`);
      }

      console.log();
    }
  }

  getRegionDump(regionName: string): MemoryRegionDump {
    const mr = this.memoryRegions.find(p => p.regionName === regionName);

    if (!mr) {
      throw new Error(`Can't find region name ${regionName}`);
    }

    const bufferSlice = this.memoryBuffer.buffer.slice(mr.startAddress, mr.startAddress + mr.lengthInBytes);
    return {
      regionInfo: mr,
      regionBuffer: bufferSlice
    };
  }
}
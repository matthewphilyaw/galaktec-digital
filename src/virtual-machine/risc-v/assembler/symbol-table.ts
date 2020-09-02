export interface SymbolDefinition {
  address?: number;
  value?: number | string | ArrayBuffer
}

export interface LocalLabel {
  nextOrdinal: number;
  matchingLabels: SymbolDefinition[]
}

export class SymbolTable {
  private symbolAddressMap: Map<string, SymbolDefinition>;
  private labelsToResolve: Map<string, ((address: number) => void)[]>

  // Used to resolve local symbols with forward or back references
  // https://doc.ecoscentric.com/gnutools/doc/as/Symbol-Names.html
  // this will map will contain the prefix LN and contains a list of
  // local labels that start with that prefix.
  //
  // To resolve a local reference like 1b or 1f you would look up
  // L1 then search through the SymbolDefinition[] for the first local label
  // whose address is greater than the current program address for a forward reference
  // or the one right before the current address (e.g find the address
  // that is greater current program address and go back index in the array
  private localLabelLookup: Map<string, SymbolDefinition[]>;

  constructor() {
    this.symbolAddressMap = new Map<string, SymbolDefinition>();
    this.localLabelLookup = new Map<string, SymbolDefinition[]>();
    this.labelsToResolve = new Map<string, ((address: number) => void)[]>();
  }

  defineLabel(name: string): void {
    if (this.symbolAddressMap.has(name)) {
      console.log(`Label: ${name} already defined`);
    }

    this.symbolAddressMap.set(name, {});
  }

  setLabelAddress(name: string, address: number): void {
    const labelSymbol = this.symbolAddressMap.get(name);
    if (!labelSymbol) {
      throw new Error(`Can not set the address of undefined Label: ${name}`);
    }

    labelSymbol.address = address;
  }

  getLabelAddress(name: string): number {
    const labelSymbol = this.symbolAddressMap.get(name);
    if (!labelSymbol) {
      throw new Error(`Can not set the address of undefined Label: ${name}`);
    }

    if (!labelSymbol.address) {
      throw new Error(`Label: ${name} has not been assigned an address`);
    }

    return labelSymbol.address;
  }

  resolveLabelsAddresses() {
    for (const [label, fns] of this.labelsToResolve.entries()) {
      const address = this.getLabelAddress(label);
      for (const fn of fns) {
        fn(address);
      }
    }
  }

  onLabelAddressResolve(labelName: string, handler: (address: number) => void) {
    const labelsToResolve = this.labelsToResolve.get(labelName);
    if (!labelsToResolve) {
      this.labelsToResolve.set(labelName, [handler]);
      return;
    }

    labelsToResolve.push(handler);
  }
}
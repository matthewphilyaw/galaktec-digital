import {VM, VMState} from './vm-wrapper';
import {createContext, ReactNode, useContext, useRef, useState} from 'react';
import {sampleProgram} from '../virtual-machine/default-program';

export interface VMControls {
  loadProgram: (program: string) => void;
  step: () => void;
}

export interface VMContext {
  vmState: VMState;
  controls: VMControls;
}

export const VirtualMachineContext = createContext<VMContext>(null!);

export function useVirtualMachineContext() {
  return useContext(VirtualMachineContext);
}

export interface VirtualMachineProviderProps {
  children: ReactNode;
}

let vm = new VM(sampleProgram);

export function VirtualMachineProvider({ children }: VirtualMachineProviderProps) {
  const vmRef = useRef(vm);
  const [vmState, setVmState] = useState<VMState>(vmRef.current.getState());

  function loadProgram(program: string) {
    vm = new VM(program);
    vmRef.current = vm;

    setVmState(vm.getState());
  }

  function step() {
    const vm = vmRef.current;

    if (!vm) {
      const msg = 'VM has not be initialized.';
      console.log(msg);
      throw msg;
    }

    vm.tick(vmState!.lastEventId + 1);
    setVmState(vm.getState());
  }

  const value = {
    vmState,
    controls: {
      loadProgram,
      step
    }
  };

  return <VirtualMachineContext.Provider value={value}>{children}</VirtualMachineContext.Provider>
}
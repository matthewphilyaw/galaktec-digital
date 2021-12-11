import React, {Dispatch} from 'react';
import {VMControls, VMState} from '../hooks/use-virtual-machine';
import Panel from '../layout/Panel';
import styles from './VMStateBlock.module.css';



export function VMStateBlock(props: { state: VMState }) {
  const { state } = props;
  return (
    <div className={styles.VMState}>
      <Panel>
        <p>stage: {state.coreState.pipelineState}</p>
        <p>PC: {state.coreState.programCounter}</p>
        <p>instruction: {state.intermediateInstruction.formattedEncodedInstructions}</p>
      </Panel>
    </div>
  );
}
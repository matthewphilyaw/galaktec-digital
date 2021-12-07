import React, {Dispatch} from 'react';
import {VMControls, VMState} from '../hooks/use-virtual-machine';



export function VMStateBlock(props: { state: VMState, dispatch: VMControls}) {
  const { state, dispatch } = props;
  return (
    <div>
      <p>stage: {state.coreState.pipelineState}</p>
      <p>PC: {state.coreState.programCounter}</p>
      <p>instruction: {state.intermediateInstruction.formattedEncodedInstructions}</p>
      <button onClick={() => dispatch.run()}>Run</button>
    </div>
  );
}
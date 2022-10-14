import styles from './HartViewer.module.css';
import {VMState} from '../../../hooks/vm-wrapper';
import Widget from '../../../components/layout/Widget';
import RegisterView from './RegisterView';
import HartSectionLayout from './HartSectionLayout';
import PipelineView from './PipelineView';
import PipelineHistoryView from './PipelineHistoryView';

export interface HartViewerProps {
  vmState: VMState;
}

export default function HartViewer({ vmState }: HartViewerProps) {
  return (
    <Widget title={'RISC V Hart'}>
      <div className={styles.content}>
        <HartSectionLayout title={'Registers'}>
          <RegisterView registerValues={vmState.coreState.registers} numberPerColumn={6} displayHex={true}/>
        </HartSectionLayout>
        <HartSectionLayout title={'Pipeline'}>
          <div className={styles.pipelineGroup}>
            <PipelineView vmState={vmState} />
            <PipelineHistoryView />
          </div>
        </HartSectionLayout>
      </div>
    </Widget>
  )
}
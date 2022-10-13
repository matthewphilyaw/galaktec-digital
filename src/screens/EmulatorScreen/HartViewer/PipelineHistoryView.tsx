import styles from './PipelineHistoryView.module.css';
import {H4} from '../../../components/layout/Heading';

interface PipelineColor {
  fetch: string;
  decode: string;
  execute: string;
  memory: string;
  writeBack: string;
}

interface PipelineSate {
  label: string;
  colors: PipelineColor;
}

function VerticalPipline({label, colors}: PipelineSate) {
  return (
    <div className={styles.verticalPipeline}>
      <label className={styles.label}>{label}</label>
      <div style={{background: colors.fetch}} />
      <div style={{background: colors.decode}} />
      <div style={{background: colors.execute}} />
      <div style={{background: colors.memory}} />
      <div style={{background: colors.writeBack}} />
    </div>
  )
}

export default function PipelineHistoryView() {
  const pipelineStates: PipelineSate[] = [
    { label: '-4', colors: { fetch: 'white', decode: '', execute: '', memory: '', writeBack: '' }},
    { label: '-3', colors: { fetch: 'pink', decode: 'white', execute: '', memory: '', writeBack: '' }},
    { label: '-2', colors: { fetch: 'yellow', decode: 'pink', execute: 'white', memory: '', writeBack: '' }},
    { label: '-1', colors: { fetch: 'red', decode: 'yellow', execute: 'pink', memory: 'white', writeBack: '' }},
    { label: '0', colors: { fetch: 'cyan', decode: 'red', execute: 'yellow', memory: 'pink', writeBack: 'white' }}
  ];

  return (
    <div className={styles.content}>
      <div className={styles.stages}>
        <label>T</label>
        <label>IF</label>
        <label>ID</label>
        <label>EX</label>
        <label>MEM</label>
        <label>WB</label>
      </div>
      <VerticalPipline {...pipelineStates[4]} />
      <VerticalPipline {...pipelineStates[3]} />
      <VerticalPipline {...pipelineStates[2]} />
      <VerticalPipline {...pipelineStates[1]} />
      <VerticalPipline {...pipelineStates[0]} />
    </div>
  );
}
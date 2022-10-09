import styles from './EmulatorScreen.module.css';
import CodeEditor from '../components/CodeEditor/CodeEditor';
import {sampleProgram} from '../virtual-machine/default-program';
import {ContentSpacer} from '../components/ContentSpacer';
import {SolidButtonBar} from '../components/SolidButtonBar';
import Widget from '../components/Widget';

export default function EmulatorScreen() {

  const buttons = [
    { text: 'LOAD', click: () => { } },
    { text: 'RUN', click: () => { } },
    { text: 'STEP', click: () => { } },
  ];

  return (
    <div className={styles.content}>
      <div className={styles.spacer}/>
      <CodeEditor initialProgram={sampleProgram} onChange={() => {}}/>
      <div className={styles.vertSpacer}>
        <ContentSpacer/>
      </div>
      <div className={styles.sideNav}>
        <SolidButtonBar layoutPosition={'left'} buttons={buttons}/>
      </div>
      <div className={styles.widgetSpace}>
          <Widget title={`mem`}>
            <div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tincidunt in nibh sit amet
              pulvinar. Suspendisse nibh ligula, maximus vitae felis id, pretium pellentesque libero. Pellentesque
              tincidunt vel dolor vitae aliquam. Aliquam efficitur ut risus sit amet rutrum. Sed malesuada orci eget
            </div>
          </Widget>
      </div>
    </div>
  );
}
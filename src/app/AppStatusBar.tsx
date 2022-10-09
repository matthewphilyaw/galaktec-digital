import styles from './AppStatusBar.module.css';
import Plate from '../components/Plate';
import FlexCenteredContent from '../components/FlexCenteredContent';
import {H4} from '../components/Heading';

export default function AppSatusBar() {
  return (
    <div className={styles.statusBar}>
      <div className={styles.poweredByLabel}>
        <Plate>
          <FlexCenteredContent>
            <H4>Property of Gigadyne Systems</H4>
          </FlexCenteredContent>
        </Plate>
      </div>
    </div>
  );
}